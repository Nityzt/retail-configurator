import axios from 'axios';
import type { Scenario } from '@/types/scenario';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scenarioApi = {
  getAll: async (): Promise<Scenario[]> => {
    const response = await api.get('/scenarios');
    return response.data;
  },

  create: async (data: Scenario): Promise<Scenario> => {
    const response = await api.post('/scenarios', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/scenarios/${id}`);
  },
};
