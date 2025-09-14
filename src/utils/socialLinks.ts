import fs from 'fs';
import path from 'path';

export interface SocialLink {
  platform: string;
  url: string;
  username: string;
}

export function getSocialLinks(): SocialLink[] {
  try {
    // Read the gigisocials.txt file
    const filePath = path.join(process.cwd(), 'gigisocials.txt');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse the links
    const links: SocialLink[] = [];

    const lines = fileContent.split('\n').filter((line) => line.trim());

    lines.forEach((line) => {
      // Expected format: "platform : @url" or "platform : url"
      const parts = line.split(':').map((part) => part.trim());

      if (parts.length >= 2) {
        const platform = parts[0]?.toLowerCase() || '';
        // Join the rest in case there are multiple colons
        const urlPart = parts.slice(1).join(':').trim();

        // Remove @ if it exists
        const url = urlPart.startsWith('@') ? urlPart.substring(1) : urlPart;

        // Extract username from url
        let username = '';
        try {
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split('/').filter(Boolean);
          username = pathParts[pathParts.length - 1] || '';

          // For specific platforms, format username
          if (
            platform === 'instagram' ||
            platform === 'twitter' ||
            platform === 'pinterest'
          ) {
            username = '@' + username;
          }
        } catch (e) {
          // If URL parsing fails, use the url as username
          username = url;
        }

        links.push({
          platform,
          url,
          username: username || url,
        });
      }
    });

    return links;
  } catch (error) {
    console.error('Error reading social links:', error);
    return [];
  }
}
