
import { Video, Project, SocialLink } from './types';

export const featuredVideos: Video[] = [
  {
    id: '1',
    title: 'React Hooks Explained',
    description: 'Learn how to use React hooks with practical examples.',
    thumbnail: 'https://img.youtube.com/vi/placeholder1/maxresdefault.jpg',
    publishedAt: '2023-10-15',
    tags: ['React', 'Hooks', 'Frontend'],
    category: 'React',
    views: 15000,
    duration: '10:21'
  },
  {
    id: '2',
    title: 'Building APIs with Node.js and Express',
    description: 'Step-by-step guide to creating REST APIs with Node and Express.',
    thumbnail: 'https://img.youtube.com/vi/placeholder2/maxresdefault.jpg',
    publishedAt: '2023-09-28',
    tags: ['Node.js', 'Express', 'API', 'Backend'],
    category: 'Node.js',
    views: 12000,
    duration: '15:45'
  },
  {
    id: '3',
    title: 'MongoDB for Beginners',
    description: 'Introduction to MongoDB for beginners with practical examples.',
    thumbnail: 'https://img.youtube.com/vi/placeholder3/maxresdefault.jpg',
    publishedAt: '2023-08-15',
    tags: ['MongoDB', 'Database', 'NoSQL'],
    category: 'Database',
    views: 18500,
    duration: '12:10'
  },
  {
    id: '4',
    title: 'TypeScript Fundamentals',
    description: 'Learn TypeScript fundamentals and how to use them in your projects.',
    thumbnail: 'https://img.youtube.com/vi/placeholder4/maxresdefault.jpg',
    publishedAt: '2023-07-22',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    category: 'TypeScript',
    views: 22000,
    duration: '20:15'
  }
];

export const allVideos: Video[] = [
  ...featuredVideos,
  {
    id: '5',
    title: 'Full Stack Authentication',
    description: 'Learn how to implement authentication in a full stack application.',
    thumbnail: 'https://img.youtube.com/vi/placeholder5/maxresdefault.jpg',
    publishedAt: '2023-06-10',
    tags: ['Authentication', 'Security', 'Full Stack'],
    category: 'Security',
    views: 11000,
    duration: '18:30'
  },
  {
    id: '6',
    title: 'CSS Grid Layout',
    description: 'Master CSS Grid Layout with practical examples and projects.',
    thumbnail: 'https://img.youtube.com/vi/placeholder6/maxresdefault.jpg',
    publishedAt: '2023-05-15',
    tags: ['CSS', 'Grid', 'Frontend', 'Layout'],
    category: 'CSS',
    views: 9500,
    duration: '14:20'
  }
];

export const featuredProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform built with MERN stack.',
    imageUrl: '/placeholder.svg',
    githubUrl: 'https://github.com/Anasobeidat02/e-commerce',
    liveUrl: 'https://e-commerce-demo.example.com',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux'],
    featured: true
  },
  {
    id: '2',
    name: 'Task Management App',
    description: 'A task management application with user authentication.',
    imageUrl: '/placeholder.svg',
    githubUrl: 'https://github.com/Anasobeidat02/task-manager',
    technologies: ['React', 'Firebase', 'Tailwind CSS'],
    featured: true
  },
  {
    id: '3',
    name: 'Real-time Chat Application',
    description: 'A real-time chat application using Socket.io.',
    imageUrl: '/placeholder.svg',
    githubUrl: 'https://github.com/Anasobeidat02/chat-app',
    liveUrl: 'https://chat-app-demo.example.com',
    technologies: ['Node.js', 'Express', 'Socket.io', 'React'],
    featured: true
  }
];

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/Anasobeidat02',
    icon: 'github'
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@anas-obeidat',
    icon: 'youtube'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/anasobeidat',
    icon: 'twitter'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/anasobeidat',
    icon: 'linkedin'
  }
];

export const skills = [
  {
    category: 'Frontend',
    technologies: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux']
  },
  {
    category: 'Backend',
    technologies: ['Node.js', 'Express.js', 'NestJS', 'GraphQL', 'REST APIs']
  },
  {
    category: 'Database',
    technologies: ['MongoDB', 'PostgreSQL', 'Redis', 'Firebase']
  },
  {
    category: 'DevOps',
    technologies: ['Docker', 'AWS', 'CI/CD', 'Git', 'GitHub Actions']
  }
];
