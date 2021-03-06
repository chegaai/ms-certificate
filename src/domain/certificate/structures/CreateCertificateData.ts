import { ObjectId } from 'bson'
import { Nullable } from '../../../utils/Nullable'

export interface CreateCertificateData {
  eventId: string | ObjectId
  templateId: string | ObjectId
  storageURL: Nullable<string>
}
