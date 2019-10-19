import { injectable } from 'tsyringe'
import { CertificateService } from './CertificateService'

@injectable()
export class Services {
  constructor (
    public readonly certificate: CertificateService
  ) { }
}
