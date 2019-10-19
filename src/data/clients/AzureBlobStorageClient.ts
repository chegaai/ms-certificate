import * as fs from 'fs'
import { ObjectId } from 'bson'
import { IAppConfig } from '../../app.config'
import { inject, injectable } from 'tsyringe'

import {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL,
  uploadStreamToBlockBlob,
} from '@azure/storage-blob'

@injectable()
export class AzureBlobStorageClient {

  private ONE_MINUTE:number = 60000;
  private containerURL: ContainerURL
  private azureBlobURL:string = ''
  private containerName: string = ''

  constructor (
    @inject('AzureBlobStorageAccountName') accountName: IAppConfig['azure']['storage']['accountName'],
    @inject('AzureBlobStorageAccountAccessKey') accountAccessKey: IAppConfig['azure']['storage']['accountAccessKey'],
    @inject('AzureBlobStorageContainerName') containerName: IAppConfig['azure']['storage']['containerName'], ) {
    this.azureBlobURL = `https://${accountName}.blob.core.windows.net`
    this.containerName = containerName 

    const credentials = new SharedKeyCredential(accountName, accountAccessKey);
    const pipeline = StorageURL.newPipeline(credentials);
    const serviceURL = new ServiceURL(this.azureBlobURL, pipeline);
    this.containerURL = ContainerURL.fromServiceURL(serviceURL, this.containerName);
  }

  async uploadBuffer(buff:Buffer) {

    const aborter = Aborter.timeout(30 * this.ONE_MINUTE);
    const imageName = `${new ObjectId()}.png`
    const blockBlobURL = BlockBlobURL.fromContainerURL(this.containerURL, imageName);

    const uploadOptions = {
        bufferSize: buff.byteLength,
        maxBuffers: 5,
    };

    const stream = fs.createReadStream(buff);

    await uploadStreamToBlockBlob(
                    aborter, 
                    stream, 
                    blockBlobURL, 
                    uploadOptions.bufferSize, 
                    uploadOptions.maxBuffers);

    return `${this.azureBlobURL}/${this.containerName}/${imageName}`
  }
}
