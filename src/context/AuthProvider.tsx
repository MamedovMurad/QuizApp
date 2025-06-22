import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth';

interface User {
  name: string;
  package: string;
  status: string;
  expired_at: string | null;
  role: 'admin' | 'user' | string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean,
  handleGetUser: () => void
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function handleGetUser() {
    if (!localStorage.getItem("agent")) {
      setLoading(false)
      return
    }
    getMe().then((data) => {
      setUser(data.data);
    }).finally(() => setLoading(false));;
  }
  useEffect(() => {

    handleGetUser()
  }, [localStorage.getItem("agent")]);

  return (
    <AuthContext.Provider value={{ user, loading, handleGetUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used inside AuthProvider');
  return context;
};
