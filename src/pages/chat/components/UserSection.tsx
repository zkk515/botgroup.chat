import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Edit2Icon, LogOutIcon } from 'lucide-react';

interface UserSectionProps {
  isOpen: boolean;
}

export const UserSection: React.FC<UserSectionProps> = ({ isOpen }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={cn(
        "px-3 py-3 border-t border-b border-border/40",
        "flex items-center gap-3 hover:bg-accent/50 transition-colors"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 头像区域 */}
      <div className="relative group cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center shadow-sm">
          <span className="text-base font-medium text-white">游</span>
        </div>
        {/* 头像hover效果 */}
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit2Icon className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* 用户信息区域 */}
      <div className="flex flex-col relative flex-1">
        <div className="flex items-center gap-1 group cursor-pointer">
          <span className="text-sm font-semibold group-hover:text-primary transition-colors">
            游客用户
          </span>
          <Edit2Icon 
            className={cn(
              "w-3 h-3 text-muted-foreground/50",
              "opacity-0 group-hover:opacity-100 transition-opacity"
            )} 
          />
        </div>
        
        {/* 退出登录按钮 */}
        <div 
          className={cn(
            "flex items-center gap-0.5 mt-0.5 text-xs text-muted-foreground/70",
            "hover:text-rose-500 transition-all duration-200 group",
            "rounded-md cursor-pointer"
          )}
          onClick={() => {
            // 这里添加退出登录的处理逻辑
            console.log('退出登录');
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
      </div>
    </div>
  );
}; 