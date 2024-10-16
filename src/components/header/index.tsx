'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  User,
  Wrench,
  Menu,
  ChevronDown,
  FileImage,
  FileSpreadsheet,
} from 'lucide-react';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

// 定义工具项类型
type ToolItemWithIcon = {
  label: string;
  path: string;
  icon?: JSX.Element;
};

type ToolGroup = {
  label: string;
  items: ToolItemWithIcon[];
};

type Tool = ToolItemWithIcon | ToolGroup;

// 工具项配置
const toolsConfig: Tool[] = [
  {
    label: '图片工具',
    items: [
      { label: '图片格式转换', path: '/convert/image-format', icon: <FileImage /> },
      { label: '图片压缩', path: '/compress/image', icon: <FileImage /> },
      { label: '图片加水印', path: '/watermark/image', icon: <FileImage /> },
      { label: '图片去水印', path: '/remove-watermark/image', icon: <FileImage /> },
    ],
  },
  { label: '拆分PDF', path: '/split-pdf' },
  { label: '压缩PDF', path: '/compress-pdf' },
  {
    label: 'PDF转换工具',
    items: [
      { label: 'JPG转PDF', path: '/convert/jpg-to-pdf', icon: <FileImage /> },
      { label: 'PPT转PDF', path: '/convert/ppt-to-pdf', icon: <FileSpreadsheet /> },
      { label: 'EXCEL转PDF', path: '/convert/excel-to-pdf', icon: <FileSpreadsheet /> },
    ],
  },
  {
    label: '所有工具',
    items: [
      { label: '更多工具', path: '/more-tools' },
      { label: '帮助文档', path: '/help' },
    ],
  },
];

const Header = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleToolsMenu = () => setIsToolsMenuOpen(!isToolsMenuOpen);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo 区域 */}
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center"
          >
            <span className="text-red-500 text-3xl mr-2">❤️</span>
            PDF
          </button>
        </div>

        {/* 桌面端导航菜单 */}
        <nav className="hidden md:flex space-x-6 text-lg">
          {toolsConfig.map((tool, index) =>
            'items' in tool ? (
              <DropdownMenu key={index} label={tool.label}>
                {tool.items.map((item, i) => (
                  <DropdownMenuItem key={i} icon={item.icon} label={item.label} href={item.path} />
                ))}
              </DropdownMenu>
            ) : (
              <NavLink key={index} href={tool.path}>
                {tool.label}
              </NavLink>
            ),
          )}
        </nav>

        {/* 图标按钮区域 */}
        <div className="flex items-center space-x-4">
          <IconButton onClick={toggleToolsMenu} icon={<Wrench />} />
          <IconButton
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            icon={resolvedTheme === 'dark' ? <Sun /> : <Moon />}
          />
          <IconButton icon={<User />} />
          <IconButton onClick={toggleMobileMenu} className="md:hidden" icon={<Menu />} />
        </div>
      </div>

      {/* 小屏幕工具菜单下拉显示，点击扳手图标时展示 */}
      {isToolsMenuOpen && (
        <div className="md:hidden mt-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 absolute right-0 w-full">
          <Accordion type="single" collapsible className="w-full">
            {toolsConfig.map((tool, index) =>
              'items' in tool ? (
                <AccordionItem key={index} value={tool.label}>
                  <AccordionTrigger>{tool.label}</AccordionTrigger>
                  <AccordionContent>
                    {tool.items.map((item, i) => (
                      <NavLink key={i} href={item.path}>
                        {item.icon} {item.label}
                      </NavLink>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <NavLink key={index} href={tool.path}>
                  {tool.label}
                </NavLink>
              ),
            )}
          </Accordion>
        </div>
      )}

      {/* 小屏幕侧边栏菜单，使用Accordion组件 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute top-16 right-0 h-auto w-full bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg">
            <Accordion type="single" collapsible className="w-full">
              {toolsConfig.map((tool, index) =>
                'items' in tool ? (
                  <AccordionItem key={index} value={tool.label}>
                    <AccordionTrigger>{tool.label}</AccordionTrigger>
                    <AccordionContent>
                      {tool.items.map((item, i) => (
                        <NavLink key={i} href={item.path}>
                          {item.icon} {item.label}
                        </NavLink>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <NavLink key={index} href={tool.path}>
                    {tool.label}
                  </NavLink>
                ),
              )}
            </Accordion>
            {/* 关闭按钮 */}
            <button
              onClick={toggleMobileMenu}
              className="absolute top-4 right-4 text-gray-800 dark:text-gray-100 font-semibold"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// IconButton 组件，用于简化图标按钮的创建
const IconButton = ({
  onClick,
  icon,
  className = '',
}: {
  onClick?: () => void;
  icon: JSX.Element;
  className?: string;
}) => (
  <Button variant="ghost" onClick={onClick} className={`p-2 ${className}`}>
    {icon}
  </Button>
);

// 单独的导航链接组件
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="flex items-center space-x-2 text-gray-800 dark:text-gray-100 hover:text-red-500 transition duration-300"
  >
    {children}
  </a>
);

// 工具栏的下拉菜单项组件
const DropdownMenuItem = ({
  icon,
  label,
  href,
}: {
  icon?: React.ReactNode;
  label: string;
  href: string;
}) => (
  <a
    href={href}
    className="flex items-center text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg transition duration-300"
  >
    {icon && <span className="mr-3">{icon}</span>}
    <span>{label}</span>
  </a>
);

// 菜单下拉组件
const DropdownMenu = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="relative group">
    <div className="group flex items-center text-gray-800 dark:text-gray-100 hover:text-red-500 transition duration-300">
      {label}
      <ChevronDown className="ml-1 w-4 h-4" />
    </div>
    <div className="absolute hidden group-hover:block bg-white dark:bg-gray-800 mt-2 shadow-lg rounded-lg z-50 left-0 p-4 min-w-max transform translate-y-2 pointer-events-auto">
      {children}
    </div>
  </div>
);

export default Header;
