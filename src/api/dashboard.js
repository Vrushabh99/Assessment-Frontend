import { apiRequest } from './client'

export const dashboard = {
  dashboard: ['dashboard'],
};

export async function getDashboardStats() {
  const response = await apiRequest(`/admin/dashboard/stats`)
  return response.data
}