import axios from 'axios';
import type { Scenario } from '@/types/scenario';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export const scenarioApi = {
  getAll: async (): Promise<Scenario[]> => {
    const response = await api.get('/scenarios');
    return response.data;
  },

  getById: async (id: string): Promise<Scenario> => {
    const response = await api.get(`/scenarios/${id}`);
    return response.data;
  },

  create: async (data: Scenario): Promise<Scenario> => {
    const response = await api.post('/scenarios', data);
    return response.data;
  },

  update: async (id: string, data: Scenario): Promise<Scenario> => {
    const response = await api.put(`/scenarios/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/scenarios/${id}`);
  },

  getPreview: async (id: string): Promise<unknown> => {
    const response = await api.get(`/scenarios/${id}/preview`);
    return response.data;
  },
};
