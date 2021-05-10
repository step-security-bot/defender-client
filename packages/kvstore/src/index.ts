import { BaseAutotaskClient } from 'defender-base-client/lib/autotask';

type KeyValueStoreCreateParams = {
  credentials: string;
  kvstoreARN: string;
};

// Imported from defender/models/src/types/key-value-store.req.d.ts
interface KeyValueStoreRequest {
  action: 'put' | 'get' | 'del';
  key: string;
  value?: string;
}

export class KeyValueStoreClient extends BaseAutotaskClient {
  public constructor(params: KeyValueStoreCreateParams) {
    super(params.credentials, params.kvstoreARN);
  }

  public async get(key: string): Promise<string | undefined> {
    const request: KeyValueStoreRequest = { action: 'get', key };
    return this.execute(request);
  }

  public async put(key: string, value: string): Promise<void> {
    // TODO: Validate maxlength
    const request: KeyValueStoreRequest = { action: 'put', key, value };
    return this.execute(request);
  }

  public async del(key: string): Promise<void> {
    const request: KeyValueStoreRequest = { action: 'del', key };
    return this.execute(request);
  }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const VERSION = require('../package.json').version;
