import { ObjectId } from 'bson'
import axios, { AxiosInstance } from 'axios'
import { inject, injectable } from 'tsyringe'
import { IAppConfig } from '../../app.config'
import { ServiceError } from '../errors/ServiceError'
import { UnresponsiveServiceError } from '../errors/UnresponsiveServiceError'

@injectable()
export class UserClient {

  private readonly client: AxiosInstance

  constructor (@inject('UserServiceConnection') connectionData: IAppConfig['microServices']['user']) {
    this.client = axios.create({ baseURL: connectionData.url })
  }

  async findById (id: ObjectId | string) {
    try {
      const { data } = await this.client.get(`/users/${new ObjectId(id).toHexString()}`)
      return data
    } catch (error) {
      if (!error.response) throw new UnresponsiveServiceError('users')
      if (error.response.status === 404) return null
      throw new ServiceError(error.response)
    }
  }
}
