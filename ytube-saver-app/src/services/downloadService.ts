export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  uploader: string;
  platform: 'youtube' | 'instagram';
  formats: VideoFormat[];
}

export interface VideoFormat {
  format_id: string;
  ext: string;
  quality: string;
  filesize?: number;
  url: string;
  format_note?: string;
}

export interface DownloadRequest {
  url: string;
  format: 'video' | 'audio';
  quality: string;
}

export interface DownloadResponse {
  success: boolean;
  message: string;
  downloadUrl?: string;
  videoInfo?: VideoInfo;
}

export class DownloadService {
  private static readonly BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api';

  static async getVideoInfo(url: string): Promise<VideoInfo> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/video-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.videoInfo;
    } catch (error) {
      console.error('Error fetching video info:', error);
      throw new Error('Failed to fetch video information');
    }
  }

  static async downloadVideo(request: DownloadRequest): Promise<DownloadResponse> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error downloading video:', error);
      throw new Error('Failed to download video');
    }
  }

  // Fallback method for client-side implementation
  static async clientSideDownload(url: string, format: 'video' | 'audio', quality: string): Promise<DownloadResponse> {
    // For browser-based fallback, we'll use a combination of approaches
    const platform = this.detectPlatform(url);
    
    if (platform === 'youtube') {
      return this.handleYouTubeDownload(url, format, quality);
    } else if (platform === 'instagram') {
      return this.handleInstagramDownload(url, format, quality);
    } else {
      throw new Error('Unsupported platform');
    }
  }

  private static detectPlatform(url: string): 'youtube' | 'instagram' | 'unknown' {
    if (this.isYouTubeUrl(url)) return 'youtube';
    if (this.isInstagramUrl(url)) return 'instagram';
    return 'unknown';
  }

  static isYouTubeUrl(url: string): boolean {
    const patterns = [
      // Standard YouTube URLs
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      // YouTube Shorts
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      // YouTube short URLs
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      // YouTube embed URLs
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      // YouTube v/ URLs
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      // YouTube URLs with additional parameters
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*[?&]v=([a-zA-Z0-9_-]{11})/,
      // YouTube Shorts with parameters
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})\??.*/
    ];
    return patterns.some(pattern => pattern.test(url));
  }

  static isInstagramUrl(url: string): boolean {
    const patterns = [
      // Instagram posts
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
      // Instagram reels  
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
      // Instagram TV
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/tv\/([a-zA-Z0-9_-]+)/,
      // Instagram stories
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/stories\/([a-zA-Z0-9_.]+)\/([0-9]+)/,
      // Instagram posts with parameters
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\??.*/,
      // Instagram reels with parameters
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/reel\/([a-zA-Z0-9_-]+)\??.*/
    ];
    return patterns.some(pattern => pattern.test(url));
  }

  private static async handleYouTubeDownload(url: string, format: string, quality: string): Promise<DownloadResponse> {
    // For YouTube, we'll provide instructions or redirect to safe services
    const videoId = this.extractYouTubeId(url);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Create a safe download URL using legitimate services or provide instructions
    return {
      success: true,
      message: 'Please follow the instructions below to download the video safely.',
      downloadUrl: `https://www.youtube.com/watch?v=${videoId}`,
      videoInfo: await this.getYouTubeVideoInfo(videoId)
    };
  }

  private static async handleInstagramDownload(url: string, format: string, quality: string): Promise<DownloadResponse> {
    // For Instagram, we'll provide similar safe alternatives
    return {
      success: true,
      message: 'Instagram downloads require special handling. Please use the desktop app or trusted browser extensions.',
      downloadUrl: url
    };
  }

  private static extractYouTubeId(url: string): string | null {
    const patterns = [
      // Standard YouTube URLs
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      // YouTube Shorts
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      // YouTube short URLs
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      // YouTube embed URLs
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      // YouTube v/ URLs
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      // YouTube URLs with additional parameters
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*[?&]v=([a-zA-Z0-9_-]{11})/,
      // YouTube Shorts with parameters
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})\??.*/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  private static async getYouTubeVideoInfo(videoId: string): Promise<VideoInfo> {
    // Mock video info - in production, you'd fetch this from YouTube API or your backend
    return {
      id: videoId,
      title: 'Video Title',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: '00:00',
      uploader: 'Channel Name',
      platform: 'youtube',
      formats: []
    };
  }

  private static generateYouTubeInstructions(videoId: string, format: string, quality: string): string {
    return `
      To download this video safely:
      1. Use official YouTube Premium for offline viewing
      2. Use trusted desktop applications like yt-dlp
      3. Use reputable browser extensions
      
      Remember to respect copyright laws and terms of service.
    `;
  }
}
