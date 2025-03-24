import React, { useState, useEffect } from 'react';
import ChatUI from './components/ChatUI';
import PhoneLogin from './components/PhoneLogin';
import './App.css';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 在组件加载时检查登录状态
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 检查登录状态
  const checkLoginStatus = async () => {
    try {
      // 从 localStorage 获取 token
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      // 验证 token 有效性
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-token`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        // token 无效，清除存储的 token
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('验证登录状态失败:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };


  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-orange-50/70 to-orange-100 flex items-center justify-center">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <div className="relative">
          <ChatUI />
          <button 
            onClick={handleLogout}
            className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            退出登录
          </button>
        </div>
      ) : (
        <PhoneLogin/>
      )}
    </>
  );
};

export default App;
