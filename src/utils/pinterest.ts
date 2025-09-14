interface PinterestImage {
  url: string;
  width: number;
  height: number;
}

// These are actual pins from Gigi's Pinterest account
const GIGI_PINTEREST_IMAGES = [
  'https://i.pinimg.com/736x/07/a8/e6/07a8e6f69440b9807918cbbc897b8c55.jpg',
  'https://i.pinimg.com/736x/0a/44/be/0a44be04e47dc7507f9bfecf7d2c68da.jpg',
  'https://i.pinimg.com/236x/26/5c/5f/265c5fcf5213acb39c1b2920a726829a.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/ba/74/90/ba7490c88eea5b411fc332c6ff190468.0000000.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/dc/b4/28/dcb4286676d31dcaed5c89a729e73562.0000000.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/41/50/bf/4150bfa73979dc8002824bf1e98732ae.0000000.jpg',
  'https://i.pinimg.com/236x/3a/7f/12/3a7f1241ce1fe81a641ac29408f533ff.jpg',
  'https://i.pinimg.com/236x/22/5d/ba/225dbae2c4f4157445b92b8705ea92db.jpg',
  'https://i.pinimg.com/236x/85/13/4a/85134abb07b707f4ed196c6779ea3bb1.jpg',
  'https://i.pinimg.com/236x/30/54/ff/3054ff96957245d5f6543fac8f34f4a6.jpg',
  'https://i.pinimg.com/236x/00/2a/26/002a2619e003f89e273dfbee7f32ee0b.jpg',
  'https://i.pinimg.com/236x/50/cf/4a/50cf4aefd38e0c0069f5d5c14f06dd19.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/a4/de/5e/a4de5e4c77a08da7bb31ee9f37971888.0000000.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/17/9f/9a/179f9ab19ac4200acf1ca9e9e379569a.0000000.jpg',
  'https://i.pinimg.com/236x/e8/2f/a4/e82fa4ca315e2b5c5ebdbbfb61b95f8d.jpg',
  'https://i.pinimg.com/236x/07/a8/e6/07a8e6f69440b9807918cbbc897b8c55.jpg',
  'https://i.pinimg.com/236x/2f/a7/a2/2fa7a2c803f1fce04409380ef4ce6079.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/c4/81/75/c4817595c195282629f0891c97ae9919.0000000.jpg',
  'https://i.pinimg.com/236x/0a/44/be/0a44be04e47dc7507f9bfecf7d2c68da.jpg',
  'https://i.pinimg.com/236x/60/70/e7/6070e70ae940fd42d968d6e4cf42b92b.jpg',
  'https://i.pinimg.com/236x/fb/21/86/fb2186264cf0a29d7518d3983230692e.jpg',
  'https://i.pinimg.com/236x/31/8e/8f/318e8f32980befcc903ed1d148ad6851.jpg',
  'https://i.pinimg.com/236x/5a/52/4b/5a524b92b28b08242949ace478e25d07.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/3b/4e/6e/3b4e6e15c983d43e7e8b4377ef0a0e47.0000000.jpg',
  'https://i.pinimg.com/236x/d7/79/44/d77944e1137d3d3cb4190ca444f5c0cd.jpg',
  'https://i.pinimg.com/236x/44/ff/04/44ff04b98910d5f2777f4173df54bfc0.jpg',
  'https://i.pinimg.com/236x/32/87/d3/3287d39c3254153eb65ff59ea04f9804.jpg',
  'https://i.pinimg.com/236x/b1/cc/c2/b1ccc23ba6a47c4da448f6883f1282fa.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/74/d9/ba/74d9babd43b97a7f9e660e1ff4c7c3c5.0000000.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/a9/94/d0/a994d09e4ce01574b8801b07d69a0fc5.0000000.jpg',
  'https://i.pinimg.com/236x/90/8a/e3/908ae34b15958db7ccdd18ec29707912.jpg',
  'https://i.pinimg.com/236x/b3/2b/5f/b32b5fb4ac50ea47174bd7f36a996d98.jpg',
  'https://i.pinimg.com/236x/12/23/8a/12238ae3b0ebb6a8d61e1161c4744948.jpg',
  'https://i.pinimg.com/236x/02/9d/2b/029d2b8f35c84e8480c1b5be51fd87fa.jpg',
  'https://i.pinimg.com/236x/8b/b9/15/8bb91593ffaea3a83ef8337de1888392.jpg',
  'https://i.pinimg.com/236x/c9/29/85/c92985432fb8d47c94314292a5c50756.jpg',
  'https://i.pinimg.com/236x/43/40/c2/4340c212c0f74c286c9d868ea8648370.jpg',
  'https://i.pinimg.com/236x/fc/85/d2/fc85d2ce12bfbcc012ae3693ac0031f0.jpg',
  'https://i.pinimg.com/236x/3e/6b/9c/3e6b9ca30ed9fc30ec56cfe59490a495.jpg',
  'https://i.pinimg.com/236x/f9/60/a3/f960a34fb0082d56ce80f639f52798c3.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/5a/5a/85/5a5a853a5d13dba5ce3517404873da8d.0000000.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/9e/d5/73/9ed573413466d3b2089f4d77c2dc2aa6.0000000.jpg',
  'https://i.pinimg.com/236x/9b/8f/a8/9b8fa8852ad553b2951cf7fe1107974f.jpg',
  'https://i.pinimg.com/236x/37/99/d7/3799d7095f91297974c79e2fb1888a76.jpg',
  'https://i.pinimg.com/236x/97/d3/f4/97d3f4ce14b8c2b49d625f54bc1c043e.jpg',
  'https://i.pinimg.com/236x/d2/dc/81/d2dc81c075a92deecd15f63f0fc5625c.jpg',
  'https://i.pinimg.com/236x/bd/9d/21/bd9d21a351a2d77556188e2dac21b7b9.jpg',
  'https://i.pinimg.com/236x/e5/86/ef/e586ef14c3a9d6dbaf1fca75e6c740b9.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/4d/7a/44/4d7a44abe70c98a28cb33fb2cedd064a.0000000.jpg',
  'https://i.pinimg.com/videos/thumbnails/originals/16/5f/90/165f90196e0dbb5dcdf983af95cc8132.0000000.jpg',
  'https://i.pinimg.com/236x/87/12/34/871234b98dba7f1350bd64aa85f5bb17.jpg',
  'https://i.pinimg.com/236x/49/85/fc/4985fc9d5fb5ec261133d7fa422c86b8.jpg',
  'https://i.pinimg.com/236x/ee/69/99/ee69997816f10edebd5cfb3505726fbd.jpg',
  'https://i.pinimg.com/236x/11/e5/5e/11e55e8091a565e61ddfa7928f90f0d7.jpg',
];

export async function fetchPinterestImages(
  username: string
): Promise<PinterestImage[]> {
  try {
    // For now, we'll return the hardcoded images
    // In a production environment, you would:
    // 1. Use Pinterest API or web scraping to get real-time pins
    // 2. Handle pagination and rate limiting
    // 3. Cache results to avoid hitting rate limits

    return GIGI_PINTEREST_IMAGES.map((url) => ({
      url,
      width: url.includes('/236x/') ? 236 : 736, // Adjust width based on URL
      height: url.includes('/236x/') ? 236 : 736, // Adjust height based on URL
    }));
  } catch (error) {
    console.error('Error fetching Pinterest images:', error);
    return [];
  }
}
