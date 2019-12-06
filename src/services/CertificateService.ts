// import axios from 'axios'
import { ObjectId } from 'bson'
import { injectable } from 'tsyringe'
import { titleCase } from 'change-case'
import { renderTemplate } from '../utils/HTML'
import { screenshotFromHtml } from '../utils/HTML'
import { UserClient } from '../data/clients/UserClient'
import { EventClient } from '../data/clients/EventClient'
import { TemplateClient } from '../data/clients/TemplateClient'
import { BlobStorageClient } from '../data/clients/BlobStorageClient'
import { Certificate } from '../domain/certificate/Certificate'
import { UserNotFoundError } from '../domain/certificate/errors/UserNotFoundError'
import { CertificateRepository } from '../data/repositories/CertificateRepository'
import { EventNotFoundError } from '../domain/certificate/errors/EventNotFoundError'
import { TemplateNotFoundError } from '../domain/certificate/errors/TemplateNotFoundError'
import { CreateCertificateData } from '../domain/certificate/structures/CreateCertificateData'
import { PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
// import { CertificateAlreadyExistsError } from '../domain/certificate/errors/CertificateAlreadyExistsError'


@injectable()
export class CertificateService {
  constructor (
    private readonly repository: CertificateRepository,
    private readonly userClient: UserClient,
    private readonly eventClient: EventClient,
    private readonly templateClient: TemplateClient,
    private readonly blobStorageClient: BlobStorageClient,
  ) { }

  private async uploadBase64(base64: string){
    const url = await this.blobStorageClient.upload(base64)
    if(!url)
      throw Error() //TODO: throw better error handler
    return url
  }

  private async generateCertificateBase64 (attendeeName: string, eventName: string, templateHTML: string, startDate: Date, endDate: Date): Promise<string> {
    const data = {
      event: {
        name: titleCase(eventName),
        date: startDate,
        workload: startDate.getHours() - endDate.getHours()
      },
      user: {
        name: titleCase(attendeeName)
      }
    }

    const html = await renderTemplate(templateHTML, data)
    return screenshotFromHtml({ html })
  }

  async create (creationData: CreateCertificateData): Promise<Certificate> {
    const event = await this.eventClient.findById(creationData.eventId)
    if (!event) throw new EventNotFoundError(creationData.eventId as string)

    const attendee = await this.userClient.findById(creationData.attendeeId)
    if (!attendee) throw new UserNotFoundError(creationData.attendeeId as string)

    const template = await this.templateClient.findById(creationData.templateId)
    if (!template) throw new TemplateNotFoundError(creationData.templateId as string)

    // if (await this.repository.existsByEventIdAndEmail(event._id, attendee.email))
    //   throw new CertificateAlreadyExistsError(event._id, attendee.id)

    const base64 = await this.generateCertificateBase64(
      attendee.name,
      event.name,
      template.html,
      new Date(event.startAt),
      new Date(event.endAt)
    )
    
    creationData.storageURL = await this.uploadBase64(base64)
    const certificate = Certificate.create(new ObjectId(), creationData)

    return this.repository.save(certificate)
  }

  async listAllByAttendeeId (attendeeId: string, page: number = 0, size: number = 10): Promise<PaginatedQueryResult<Certificate>> {
    return this.repository.getAllByAttendeeId(new ObjectId(attendeeId), page, size)
  }
}
