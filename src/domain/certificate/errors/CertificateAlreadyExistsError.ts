import { DomainError } from '../../domain.error'

export class CertificateAlreadyExistsError extends DomainError {
  constructor (eventId: string, attendeeId: string) {
    super(`This certificate already exist for ${eventId} with  attendee ${attendeeId}`)
  }
}
