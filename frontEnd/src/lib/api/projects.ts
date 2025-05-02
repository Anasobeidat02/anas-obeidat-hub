
import { Project } from '../types';
import { API_URL } from './utils';
import { featuredProjects } from '../data';

export const getFeaturedProjects = async (): Promise<Project[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return featuredProjects.filter(project => project.featured);
};

export const getAllProjects = async (): Promise<Project[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return featuredProjects;
};

export const getGitHubRepositories = async (): Promise<Project[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return featuredProjects;
};
