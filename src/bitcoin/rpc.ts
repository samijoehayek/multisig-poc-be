import axios from 'axios';

export class BitcoinRPC {
  constructor(
    private readonly baseUrl: string,
    private readonly username: string,
    private readonly password: string,
  ) {}

  async call(method: string, params: any[] = [], wallet?: string) {
    const url = wallet ? `${this.baseUrl}/wallet/${wallet}` : this.baseUrl;

    const res = await axios.post(
      url,
      { jsonrpc: '1.0', id: 'nest', method, params },
      { auth: { username: this.username, password: this.password } },
    );

    if (res.data?.error) throw new Error(res.data.error.message);
    return res.data.result;
  }
}
