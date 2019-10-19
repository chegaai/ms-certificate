// import axios from 'axios'
import { render } from 'ejs'
import { JSDOM }  from 'jsdom'
import { ObjectId } from 'bson'
import { injectable } from 'tsyringe'
import { titleCase } from 'change-case'
import htmlToImage from 'html-to-image';
import { UserClient } from '../data/clients/UserClient'
import { EventClient } from '../data/clients/EventClient'
import { TemplateClient } from '../data/clients/TemplateClient'
import { AzureBlobStorageClient } from '../data/clients/AzureBlobStorageClient'
import { Certificate } from '../domain/certificate/Certificate'
import { UserNotFoundError } from '../domain/certificate/errors/UserNotFoundError'
import { CertificateRepository } from '../data/repositories/CertificateRepository'
import { EventNotFoundError } from '../domain/certificate/errors/EventNotFoundError'
import { TemplateNotFoundError } from '../domain/certificate/errors/TemplateNotFoundError'
import { CreateCertificateData } from '../domain/certificate/structures/CreateCertificateData'
import { CertificateAlreadyExistsError } from '../domain/certificate/errors/CertificateAlreadyExistsError'


@injectable()
export class CertificateService {
  constructor (
    private readonly repository: CertificateRepository,
    private readonly userClient: UserClient,
    private readonly eventClient: EventClient,
    private readonly templateClient: TemplateClient,
    private readonly azureBlobStorageClient: AzureBlobStorageClient,
  ) { }

  // TODO: fix this "any" type
  private async renderTemplate (template: string, data: any): Promise<string> {
    return render(template, data)
  }

  private async createBuffer (htmlContent: string): Promise<Buffer> {
    const element = new JSDOM(htmlContent).window.document.body;
    const dataUrl = await htmlToImage.toPng(element)
    const base64 = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "")
    return Buffer.from(base64,"base64");
  }

  private async generateCertificateBuffer(ateendee: string, event: string, templateHTML: string, startDate: Date, endDate: Date): Promise<Buffer> {
    const data = {
      event: {
        name: titleCase(event),
        date: startDate.getDate(),
        workload: startDate.getHours() - endDate.getHours()
      },
      user: {
        name: titleCase(ateendee)
      }
    }
    
    const html = await this.renderTemplate(templateHTML, data)
    return this.createBuffer(html)
  }

  async create (creationData: CreateCertificateData): Promise<Certificate> {
    const event = await this.eventClient.findById(creationData.eventId)
    if (!event) throw new EventNotFoundError(creationData.eventId as string)

    const ateendee = await this.userClient.findById(creationData.ateendeeId)
    if (!ateendee) throw new UserNotFoundError(creationData.ateendeeId as string)

    const template = await this.templateClient.findById(creationData.templateId)
    if (!template) throw new TemplateNotFoundError(creationData.templateId as string)

    if (await this.repository.existsByEventIdAndEmail(event.id, ateendee.email))
      throw new CertificateAlreadyExistsError(event.id, ateendee.id)
    
    const buff = await this.generateCertificateBuffer(
      ateendee.name, 
      event.name, 
      template.html, 
      new Date(event.hour.start), 
      new Date(event.hour.end)
    )

    creationData.storageURL = await this.azureBlobStorageClient.uploadBuffer(buff)

    const certificate = Certificate.create(new ObjectId(), creationData)

    return this.repository.save(certificate)
  }

}
