import { Injectable } from '@nestjs/common';

@Injectable()
export class ProxyAdapter {
  execute({}): string {
    const apiEndpoint = req.originalUrl.slice(7, 999);
    const apiUrl = `http://localhost:8080/${apiEndpoint}`;

    try {
      const response$ = this.httpService.request({
        method: req.method,
        url: apiUrl,
        data: req.body,
        headers: req.headers,
      });

      const response = await firstValueFrom(response$);

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({ message: 'Error occurred while proxying request.' });
    }
  }
}