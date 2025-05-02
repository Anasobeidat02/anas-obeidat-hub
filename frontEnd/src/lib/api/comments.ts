
import { Comment } from '../types';
import { API_URL } from './utils';

export const getCommentsForVideo = async (videoId: string): Promise<Comment[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const comments: Comment[] = [
    {
      id: '1',
      videoId,
      user: {
        name: 'محمد أحمد',
        avatar: '/placeholder.svg',
      },
      content: 'شرح رائع جدا، استفدت كثيرا من هذا الفيديو!',
      createdAt: '2023-11-15T08:30:00',
      replies: [
        {
          id: '1-1',
          videoId,
          user: {
            name: 'أنس عبيدات',
            avatar: '/placeholder.svg',
          },
          content: 'شكرا لك! سعيد أنك استفدت من المحتوى.',
          createdAt: '2023-11-15T09:15:00',
        }
      ]
    },
    {
      id: '2',
      videoId,
      user: {
        name: 'سارة محمود',
        avatar: '/placeholder.svg',
      },
      content: 'هل يمكنك عمل فيديو عن أفضل ممارسات تنظيم ملفات المشروع؟',
      createdAt: '2023-11-14T17:20:00',
    }
  ];
  
  return comments;
};

export const addComment = async (videoId: string, content: string): Promise<Comment> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newComment: Comment = {
    id: `new-${Date.now()}`,
    videoId,
    user: {
      name: 'User',
      avatar: '/placeholder.svg',
    },
    content,
    createdAt: new Date().toISOString(),
  };
  
  return newComment;
};
