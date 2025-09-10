// Quick test for URL validation
import { DownloadService } from '../services/downloadService';

// Test the specific URL you mentioned
const testUrl = 'https://www.youtube.com/shorts/Zdscg2Q2IQQ?feature=share';

console.log('Testing URL:', testUrl);
console.log('Is YouTube URL:', DownloadService.isYouTubeUrl(testUrl));
console.log('Is Instagram URL:', DownloadService.isInstagramUrl(testUrl));

// Test other YouTube formats
const testUrls = [
  'https://www.youtube.com/watch?v=Zdscg2Q2IQQ',
  'https://youtu.be/Zdscg2Q2IQQ',
  'https://www.youtube.com/shorts/Zdscg2Q2IQQ',
  'https://www.youtube.com/shorts/Zdscg2Q2IQQ?feature=share',
  'https://instagram.com/p/ABC123/',
  'https://instagram.com/reel/XYZ789/',
  'https://www.instagram.com/reel/XYZ789/?utm_source=ig_web_copy_link'
];

testUrls.forEach(url => {
  console.log(`URL: ${url}`);
  console.log(`  YouTube: ${DownloadService.isYouTubeUrl(url)}`);
  console.log(`  Instagram: ${DownloadService.isInstagramUrl(url)}`);
  console.log('---');
});

export {};
