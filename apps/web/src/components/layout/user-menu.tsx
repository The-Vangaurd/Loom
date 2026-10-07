"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, Shield, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
  };
  onLogout?: () => void;
  className?: string;
}

export function UserMenu({ user, onLogout, className }: UserMenuProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("focus:outline-none", className)}>
        <div className="flex items-center space-x-2.5 p-1 rounded-full hover:ring-2 hover:ring-border-strong transition-all">
          <Avatar className="h-8 w-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-0.5">
            <p className="text-xs font-semibold text-text-primary">{user.name}</p>
            <p className="text-[11px] text-text-tertiary truncate">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] uppercase font-mono text-accent">
              {user.role}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User size={14} className="mr-2 text-text-tertiary" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings size={14} className="mr-2 text-text-tertiary" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Shield size={14} className="mr-2 text-text-tertiary" />
          <span>Security & MFA</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} destructive>
          <LogOut size={14} className="mr-2" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
