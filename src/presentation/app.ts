import { routes } from './routes'
import { container } from 'tsyringe'
import expresso from '@expresso/app'
import errors from '@expresso/errors'
import { Services } from '../services'
import { IAppConfig } from '../app.config'
import { createConnection } from '@nindoo/mongodb-data-layer'
import tracing from '@expresso/tracing'

export const app = expresso(async (app, config: IAppConfig, environment: string) => {
  const mongodbConnection = await createConnection(config.database.mongodb)
  container.register('MongodbConnection', { useValue: mongodbConnection })
  container.register('UserServiceConnection', { useValue: config.microServices.user })
  container.register('EventServiceConnection', { useValue: config.microServices.event })
  container.register('EventTemplateConnection', { useValue: config.microServices.template })
  container.register('BlobStorageConfig', { useValue: config.azure.storage })

  const services = container.resolve(Services)

  app.use(tracing.factory())

  app.post('/', routes.create(services.certificate))
  app.get('/attendees/:attendeeId', routes.listAllByAttendeeId(services.certificate))

  app.use(errors(environment))
})
