import { DomainError } from '../../domain.error'

export class CertificateAlreadyExistsError extends DomainError {
  constructor (eventId: string, ateendeeId: string) {
    super(`This certificate already exist for ${eventId} with  ateendee ${ateendeeId}`)
  }
}
