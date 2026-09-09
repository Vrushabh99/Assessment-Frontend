import { apiRequest } from './client'

export const DashboardKeys = {
  dashboard: ['Dashboard'],
};

export async function getDashboardStats() {
  const response = await apiRequest(`/admin/dashboard/stats`)
  return response.data
}