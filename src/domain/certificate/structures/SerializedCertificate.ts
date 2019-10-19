import { ObjectId } from 'bson'
import { Nullable } from '../../../utils/Nullable'

export interface SerializedCertificate {
  _id: ObjectId
  eventId: ObjectId
  ateendeeId: ObjectId
  templateId: ObjectId
  storageURL: Nullable<string>
  createdAt: Date
  updatedAt: Date
  deletedAt: Nullable<Date>
}
