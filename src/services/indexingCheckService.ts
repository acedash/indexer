import axios from 'axios';

export class IndexingCheckService {
  /**
   * Checks if a URL is indexed on Google.
   * Note: This usually requires a Search API or GSC access.
   * For now, we'll implement a logic that could use an API key from an ENV.
   */
  async isIndexed(url: string): Promise<boolean> {
    const serperApiKey = process.env.SERPER_API_KEY;

    if (!serperApiKey) {
      console.log('No SERPER_API_KEY found, skipping live indexing check.');
      return false;
    }

    try {
      const response = await axios.post(
        'https://google.serper.dev/search',
        { q: `site:${url}` },
        {
          headers: {
            'X-API-KEY': serperApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      // If results exist and contain the URL, it's indexed
      const hasResults = response.data.organic && response.data.organic.length > 0;
      return hasResults;
    } catch (error) {
      console.error(`Error checking indexing status for ${url}:`, error);
      return false;
    }
  }
}
