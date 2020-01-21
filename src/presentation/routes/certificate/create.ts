import { IExpressoRequest } from '@expresso/app'
import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { validate } from '@expresso/validator'
import { Request, Response, NextFunction } from 'express'
import { CertificateService } from '../../../services/CertificateService'
import { ProfileNotFoundError } from '../../../domain/certificate/errors/ProfileNotFoundError'
import { EventNotFoundError } from '../../../domain/certificate/errors/EventNotFoundError'
import { TemplateNotFoundError } from '../../../domain/certificate/errors/TemplateNotFoundError'
import { CertificateAlreadyExistsError } from '../../../domain/certificate/errors/CertificateAlreadyExistsError'
import { CreateCertificateData } from '../../../domain/certificate/structures/CreateCertificateData'

export function factory (service: CertificateService) {
  return [
    validate({
      type: 'object',
      properties: {
        eventId: { type: 'string' },
        templateId: { type: 'string' }
      },
      required: ['eventId', 'templateId'],
      additionalProperties: false
    }),
    rescue(async (req: IExpressoRequest<CreateCertificateData>, res: Response) => {
      const certificate = await service.create(req.onBehalfOf as string, req.body)

      res.status(201)
        .json(certificate)
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof CertificateAlreadyExistsError) return next(boom.conflict(err.message, { code: 'certificate_already_exists' }))
      if (err instanceof ProfileNotFoundError) return next(boom.badData(err.message, { code: 'profile_not_found' }))
      if (err instanceof EventNotFoundError) return next(boom.badData(err.message, { code: 'event_not_found' }))
      if (err instanceof TemplateNotFoundError) return next(boom.badData(err.message, { code: 'template_not_found' }))

      next(err)
    }
  ]
}
