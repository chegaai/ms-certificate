import { Db } from 'mongodb'
import { ObjectId } from 'bson'
import { inject, injectable } from 'tsyringe'
import { Certificate } from '../../domain/certificate/Certificate'
import { MongodbRepository, PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { SerializedCertificate } from '../../domain/certificate/structures/SerializedCertificate'

@injectable()
export class CertificateRepository extends MongodbRepository<Certificate, SerializedCertificate> {
  static collection = 'certificates'
  constructor (@inject('MongodbConnection') connection: Db) {
    super(connection.collection(CertificateRepository.collection))
  }

  serialize (entity: Certificate) {
    return entity.toObject()
  }

  deserialize (data: SerializedCertificate): Certificate {
    const { _id, attendeeId, ...certificateData } = data
    return Certificate.create(_id, attendeeId.toHexString(), certificateData)
  }

  async existsByEventIdAndEmail (eventId: string, attendeeId: string): Promise<boolean> {
    return this.existsBy({ eventId, attendeeId, deletedAt: null })
  }

  async getAll (page: number, size: number): Promise<PaginatedQueryResult<Certificate>> {
    return this.runPaginatedQuery({ deletedAt: null }, page, size)
  }

  async findManyById (communityIds: ObjectId[], page: number, size: number): Promise<PaginatedQueryResult<Certificate>> {
    return this.runPaginatedQuery({ _id: { $in: communityIds }, deletedAt: null }, page, size)
  }

  async getAllByAttendeeId (attendeeId: ObjectId, page: number, size: number): Promise<PaginatedQueryResult<Certificate>> {
    return this.runPaginatedQuery({ deletedAt: null, attendeeId }, page, size)
  }
}
