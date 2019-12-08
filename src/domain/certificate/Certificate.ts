import { ObjectId } from 'bson'
import { Nullable } from '../../utils/Nullable'
import { BaseEntity, BaseEntityData } from '../BaseEntity'
import { CreateCertificateData } from './structures/CreateCertificateData'

export class Certificate extends BaseEntity {
  id: ObjectId = new ObjectId()
  eventId: ObjectId = new ObjectId()
  attendeeId: ObjectId = new ObjectId()
  templateId: ObjectId = new ObjectId()
  storageURL: Nullable<string> = null

  static create (id: ObjectId, data: CreateCertificateData & BaseEntityData): Certificate {
    const certificate = new Certificate()
    certificate.id = id
    certificate.eventId = new ObjectId(data.eventId)
    certificate.attendeeId = new ObjectId(data.attendeeId)
    certificate.templateId = new ObjectId(data.templateId)
    certificate.storageURL = data.storageURL

    if (data.createdAt) certificate.createdAt = data.createdAt
    if (data.updatedAt) certificate.updatedAt = data.updatedAt
    if (data.deletedAt) certificate.deletedAt = data.deletedAt
    console.log(certificate)
    return certificate
  }

  update (dataToUpdate: CreateCertificateData) {
    this.templateId = new ObjectId(dataToUpdate.templateId)
    this.storageURL = dataToUpdate.storageURL
    this.updatedAt = new Date()
    return this
  }

  toObject () {
    return {
      _id: this.id,
      eventId: this.eventId,
      attendeeId: this.attendeeId,
      templateId: this.templateId,
      storageURL: this.storageURL,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    }
  }
}
