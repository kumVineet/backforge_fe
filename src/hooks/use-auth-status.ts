import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';

export const useAuthStatus = () => {
  const { isAuthenticated, user } = useAuthStore();

  return {
    isAuthenticated,
    user,
    hasValidToken: isAuthenticated
  };
};
