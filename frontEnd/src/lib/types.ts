
export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl?: string;
  thumbnail: string;
  publishedAt: string;
  tags: string[];
  category: string;
  playlist?: string;
  views: number;
  duration: string;
  content?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl?: string;
  technologies: string[];
  featured: boolean;
}

export interface Comment {
  id: string;
  videoId: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface ProgrammingLanguage {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  content: string;
  requirements: string[];
  useCases: string[];
  libraries: Array<{
    name: string;
    description: string;
    url: string;
  }>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
