import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { CertificateService } from '../../../services/CertificateService'
import { UserNotFoundError } from '../../../domain/certificate/errors/UserNotFoundError'
import { EventNotFoundError } from '../../../domain/certificate/errors/EventNotFoundError'
import { TemplateNotFoundError } from '../../../domain/certificate/errors/TemplateNotFoundError'
import { CertificateAlreadyExistsError } from '../../../domain/certificate/errors/CertificateAlreadyExistsError'

export function factory (service: CertificateService) {
  return [
    validate({
      type: 'object',
      properties: {
        eventId: { type: 'string' },
        ateendeeId: { type: 'string' },
        templateId: { type: 'string' }
      },
      required: ['eventId', 'ateendeeId', 'templateId'],
      additionalProperties: false
    }),
    rescue(async (req: Request, res: Response) => {
      await service.create(req.body)

      res.status(201)
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof CertificateAlreadyExistsError) return next(boom.conflict(err.message, { code: 'certificate_already_exists' }))
      if (err instanceof UserNotFoundError) return next(boom.badData(err.message, { code: 'user_not_found' }))
      if (err instanceof EventNotFoundError) return next(boom.badData(err.message, { code: 'event_not_found' }))
      if (err instanceof TemplateNotFoundError) return next(boom.badData(err.message, { code: 'template_not_found' }))

      next(err)
    }
  ]
}
