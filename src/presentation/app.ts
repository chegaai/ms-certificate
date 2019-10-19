import { routes } from './routes'
import { container } from 'tsyringe'
import expresso from '@expresso/app'
import errors from '@expresso/errors'
import { Services } from '../services'
import { IAppConfig } from '../app.config'
import { createConnection } from '@nindoo/mongodb-data-layer'

export const app = expresso(async (app, config: IAppConfig, environment: string) => {
  const mongodbConnection = await createConnection(config.database.mongodb)
  container.register('MongodbConnection', { useValue: mongodbConnection })
  container.register('UserServiceConnection', { useValue: config.microServices.user })
  container.register('EventServiceConnection', { useValue: config.microServices.event })
  container.register('AzureBlobStorageAccountName', { useValue: config.azure.storage.accountName })
  container.register('AzureBlobStorageAccountAccessKey', { useValue: config.azure.storage.accountAccessKey })
  container.register('AzureBlobStorageContainerName', { useValue: config.azure.storage.containerName })

  const services = container.resolve(Services)

  app.post('/certificates', routes.create(services.certificate))

  app.use(errors(environment))
})
