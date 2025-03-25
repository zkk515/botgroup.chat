import { useNavigate } from 'react-router-dom';
import PhoneLogin from './comonents/PhoneLogin';

export default function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    navigate('/');
  };

  return (
    <div className="login-container">
      <PhoneLogin handleLoginSuccess={handleLoginSuccess} />
    </div>
  );
} 