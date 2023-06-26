import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

type ProxyRequest = {
  originalUrl: string;
  method: string;
  body: Record<string, unknown>;
  headers: any;
};

type ProxyResponse = {
  status: number;
  data: Record<string, unknown>;
};

@Injectable()
export class ProxyAdapter {
  constructor(private readonly httpService: HttpService) {}

  async execute({
    originalUrl,
    method,
    body,
    headers,
  }: ProxyRequest): Promise<ProxyResponse> {
    const apiEndpoint = originalUrl.slice(7, 999);
    const apiUrl = `http://localhost:8080/${apiEndpoint}`;

    try {
      const response$ = this.httpService.request({
        method: method,
        url: apiUrl,
        data: body,
        headers: headers,
        // httpsAgent: { rejectUnauthorized: false },
      });
      const response = await firstValueFrom(response$);

      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      throw Error('Error occurred while proxying request.');
    }
  }
}
