import { DomainError } from '../../domain.error'

export class ProfileNotFoundError extends DomainError {
  constructor (id: string) {
    super(`Profile ${id} does not exist`)
  }
}
