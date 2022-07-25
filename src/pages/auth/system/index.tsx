import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuery from '@/commons/hooks/useQuery';
import { useAuth } from '@/commons/contexts/auth.context';

const AuthSystem: React.FC = () => {
  const navigate = useNavigate();
  const { validateToken } = useAuth();
  const query = useQuery();

  const [token] = useState(query.get('token'));
  const [to] = useState(query.get('to'));

  useEffect(() => {
    handleValidateToken();
  }, []);

  const handleValidateToken = async () => {
    const isValid = await validateToken(token);

    if (!to) throw Error('Destiny route is missing');

    if (isValid) {
      navigate(to);
    } else {
      navigate('/app');
    }
  };

  return <div />;
}

export default AuthSystem;