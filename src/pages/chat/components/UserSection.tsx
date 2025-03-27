import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Edit2Icon, LogOutIcon, CheckIcon, XIcon } from 'lucide-react';
import { request } from '@/utils/request';

interface UserSectionProps {
  isOpen: boolean;
}

// 添加用户信息接口
interface UserInfo {
  nickname: string;
  avatar_url?: string;
}

export const UserSection: React.FC<UserSectionProps> = ({ isOpen }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        const response = await request('/api/user/info');
        const { data } = await response.json();
        console.log('data', data);
        setUserInfo(data);
      } catch (error) {
        console.error('获取用户信息失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [isOpen]);

  // 添加更新昵称的函数
  const updateNickname = async () => {
    if (!newNickname.trim()) return;
    
    try {
      setIsLoading(true);
      const response = await request('/api/user/update', {
        method: 'POST',
        body: JSON.stringify({ nickname: newNickname.trim() })
      });
      const { data } = await response.json();
      setUserInfo(data);
      setIsEditing(false);
    } catch (error) {
      console.error('更新昵称失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    <div 
      className={cn(
        "px-3 py-3 border-t border-b border-border/40 h-20",
        "flex items-center gap-3 hover:bg-accent/50 transition-colors"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 头像区域 */}
      <div className="relative group cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center shadow-sm">
          <span className="text-base font-medium text-white">
            {isLoading ? '...' : userInfo?.nickname?.[0] || '我'}
          </span>
        </div>
        {/* 头像hover效果 */}
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit2Icon className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* 用户信息区域 */}
      <div className="flex flex-col relative flex-1">
        <div className="flex items-center  group cursor-pointer">
          {isEditing ? (
            <div className="flex flex-col">
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                className="text-sm px-2  border rounded-md w-full"
                placeholder={userInfo?.nickname || '输入新昵称'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') updateNickname();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                autoFocus
              />
              <div className="flex items-center gap-1">
                <button
                  onClick={updateNickname}
                  className="p-1 hover:bg-emerald-50 rounded-md transition-colors"
                  title="保存"
                >
                  <CheckIcon className="w-4 h-4 text-emerald-600 hover:text-emerald-500" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 hover:bg-rose-50 rounded-md transition-colors"
                  title="取消"
                >
                  <XIcon className="w-4 h-4 text-rose-600 hover:text-rose-500" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                {isLoading ? '加载中...' : userInfo?.nickname || '游客用户'}
              </span>
              <Edit2Icon 
                className={cn(
                  "w-3 h-3 text-muted-foreground/50",
                  "opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                )}
                onClick={() => {
                  setIsEditing(true);
                  setNewNickname(userInfo?.nickname || '');
                }}
              />
            </>
          )}
        </div>
        
        {/* 退出登录按钮 */}
        {!isEditing && (
          <div 
            className={cn(
              "flex items-center gap-0.5 mt-1 text-xs text-muted-foreground/70",
              "hover:text-rose-500 transition-all duration-200 group",
              "rounded-md cursor-pointer"
            )}
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            <LogOutIcon 
              className={cn(
                "w-3 h-3",
                "group-hover:animate-pulse"
              )} 
            />
            <span className="group-hover:tracking-wide transition-all duration-200">
              退出登录
            </span>
          </div>
        )}
      </div>
    </div>
  );
}; 