import { google } from 'googleapis';

export class GoogleIndexingService {
  private auth;
  private indexing;

  constructor(serviceAccountJson: string) {
    const credentials = JSON.parse(serviceAccountJson);
    this.auth = new google.auth.JWT(
      credentials.client_email,
      undefined,
      credentials.private_key,
      ['https://www.googleapis.com/auth/indexing']
    );
    this.indexing = google.indexing({ version: 'v3', auth: this.auth });
  }

  async notify(url: string) {
    try {
      const response = await this.indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Google Indexing API error for ${url}:`, error.message);
      throw error;
    }
  }

  async getStatus(url: string) {
    try {
      const response = await this.indexing.urlNotifications.getMetadata({
        url: url,
      });
      return response.data;
    } catch (error: any) {
      console.error(`Google Indexing API Get Status error for ${url}:`, error.message);
      throw error;
    }
  }
}
