import env from 'sugar-env'
import { IExpressoConfigOptions } from '@expresso/app'
import { IMongoParams } from '@nindoo/mongodb-data-layer'
import { IServerConfig } from '@expresso/server'

export interface IAppConfig extends IExpressoConfigOptions {
  name: string,
  database: {
    mongodb: IMongoParams
  },
  server?: IServerConfig['server'],
  microServices: {
    user: {
      url: string
    },
    event: {
      url: string
    },
    template: {
      url: string
    }
  },
  azure: {
    storage: {
      accountName: string,
      accountAccessKey: string,
      containerName: string,
      timeOut: number
    }
  }
}

export const config: IAppConfig = {
  name: 'ms-certificates',
  server: {
    printOnListening: true,
  },
  database: {
    mongodb: {
      uri: env.get('DATABASE_MONGODB_URI', ''),
      dbName: env.get('DATABASE_MONGODB_DBNAME', 'certificate'),
      maximumConnectionAttempts: 5,
      options: {}
    }
  },
  microServices: {
    user: {
      url: env.get('MICROSERVICE_USER_URL', '')
    },
    event: {
      url: env.get('MICROSERVICE_EVENT_URL', '')
    },
    template: {
      url: env.get('MICROSERVICE_TEMPLATE_URL', '')
    }
  },
  azure: {
    storage: {
      accountName: env.get('AZURE_STORAGE_ACCOUNT_NAME', 'chegaai'),
      accountAccessKey: env.get('AZURE_STORAGE_ACCOUNT_ACCESS_KEY', ''),
      containerName: env.get('AZURE_STORAGE_CONTAINER_NAME', 'certificates'),
      timeOut: 90000
    }
  }
}
