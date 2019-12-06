import { ObjectId } from 'bson'
import axios, { AxiosInstance } from 'axios'
import { inject, injectable } from 'tsyringe'
import { IAppConfig } from '../../app.config'
import { ServiceError } from '../errors/ServiceError'
import { UnresponsiveServiceError } from '../errors/UnresponsiveServiceError'
import { TemplateResponse } from './structures/TemplateResponse'

@injectable()
export class TemplateClient {

  private readonly client: AxiosInstance

  constructor (@inject('EventTemplateConnection') connectionData: IAppConfig['microServices']['template']) {
    this.client = axios.create({ baseURL: connectionData.url })
  }

  async findById (id: ObjectId | string): Promise<TemplateResponse | null> {
    try {
      const { data } = await this.client.get(`/${new ObjectId(id).toHexString()}`)
      return data
    } catch (error) {
      if (!error.response) throw new UnresponsiveServiceError('templates')
      if (error.response.status === 404) return null
      throw new ServiceError(error.response)
    }
  }
}
