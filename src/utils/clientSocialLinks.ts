import { SocialLink } from './socialLinks';

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  try {
    const response = await fetch('/api/public/social-links');

    if (!response.ok) {
      throw new Error('Failed to fetch social links');
    }

    const data = await response.json();
    return data.links || [];
  } catch (error) {
    console.error('Error fetching social links:', error);
    return [];
  }
}
