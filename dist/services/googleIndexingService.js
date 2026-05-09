import { google } from 'googleapis';
export class GoogleIndexingService {
    auth;
    indexing;
    constructor(credentials) {
        this.auth = new google.auth.JWT({
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });
        this.indexing = google.indexing({ version: 'v3', auth: this.auth });
    }
    async notify(url) {
        try {
            const response = await this.indexing.urlNotifications.publish({
                requestBody: {
                    url: url,
                    type: 'URL_UPDATED',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error(`Google Indexing API error for ${url}:`, error.message);
            throw error;
        }
    }
    async getStatus(url) {
        try {
            const response = await this.indexing.urlNotifications.getMetadata({
                url: url,
            });
            return response.data;
        }
        catch (error) {
            console.error(`Google Indexing API status error for ${url}:`, error.message);
            throw error;
        }
    }
}
//# sourceMappingURL=googleIndexingService.js.map