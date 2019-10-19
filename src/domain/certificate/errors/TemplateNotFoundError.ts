import { DomainError } from '../../domain.error'

export class TemplateNotFoundError extends DomainError {
  constructor (id: string) {
    super(`Template ${id} does not exist`)
  }
}
