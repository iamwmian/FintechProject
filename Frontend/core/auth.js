import { useAuth } from '@clerk/clerk-expo';

export async function getAuthHeader() {
  const { getToken } = useAuth();
  const token = await getToken();
  return { Authorization: `Bearer ${token}` };
}
