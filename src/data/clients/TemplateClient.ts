import { ObjectId } from 'bson'
import axios, { AxiosInstance } from 'axios'
import { inject, injectable } from 'tsyringe'
import { IAppConfig } from '../../app.config'
import { ServiceError } from '../errors/ServiceError'
import { UnresponsiveServiceError } from '../errors/UnresponsiveServiceError'

@injectable()
export class TemplateClient {

  private readonly client: AxiosInstance

  constructor (@inject('EventServiceConnection') connectionData: IAppConfig['microServices']['template']) {
    this.client = axios.create({ baseURL: connectionData.url })
  }

  async findById (id: ObjectId | string) {
    try {
      const { data } = await this.client.get(`/templates/${new ObjectId(id).toHexString()}`)
      return data
    } catch (error) {
      if (!error.response) throw new UnresponsiveServiceError('templates')
      if (error.response.status === 404) return null
      throw new ServiceError(error.response)
    }
  }
}
