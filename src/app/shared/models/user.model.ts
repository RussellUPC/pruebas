export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType: 'client' | 'consultant';
  avatar?: string;
  createdAt: Date;
}

export interface Consultant extends User {
  specialties: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  availability: boolean;
  description: string;
  certifications?: string[];
}

export interface Client extends User {
  company?: string;
}