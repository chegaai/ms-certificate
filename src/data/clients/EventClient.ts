import { ObjectId } from 'bson'
import axios, { AxiosInstance } from 'axios'
import { inject, injectable } from 'tsyringe'
import { IAppConfig } from '../../app.config'
import { ServiceError } from '../errors/ServiceError'
import { UnresponsiveServiceError } from '../errors/UnresponsiveServiceError'
import { EventResponse } from './structures/EventResponse'

@injectable()
export class EventClient {

  private readonly client: AxiosInstance

  constructor (@inject('EventServiceConnection') connectionData: IAppConfig['microServices']['event']) {
    this.client = axios.create({ baseURL: connectionData.url })
  }

  async findById (id: ObjectId | string): Promise<EventResponse | null> {
    try {
      const { data } = await this.client.get(`/${new ObjectId(id).toHexString()}`)
      return data
    } catch (error) {
      if (!error.response) throw new UnresponsiveServiceError('events')
      if (error.response.status === 404) return null
      throw new ServiceError(error.response)
    }
  }
}
