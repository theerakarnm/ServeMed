"use client";

import { Link, useLocation } from '@remix-run/react';
import { cn } from '@workspace/ui/lib/utils';
import { BarChart3, Box, Grid3X3, Home, ImageIcon, Layers, Package, PanelTop, ShoppingBag, Star, Tag } from 'lucide-react';

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    label: "Brands",
    icon: Tag,
    href: "/brands",
  },
  {
    label: "Categories",
    icon: Grid3X3,
    href: "/categories",
  },
  {
    label: "Products",
    icon: Package,
    href: "/products",
  },
  {
    label: "Product Variants",
    icon: Layers,
    href: "/variants",
  },
  {
    label: "Product Images",
    icon: ImageIcon,
    href: "/images",
  },
  {
    label: "Supplement Facts",
    icon: Box,
    href: "/supplement-facts",
  },
  {
    label: "Product Rankings",
    icon: Star,
    href: "/rankings",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full border-r bg-background w-64">
      <div className="p-6">
        <Link to={'/'} className="flex flex-col justify-center gap-2">
          <img src="/ServeMedLogo.avif" alt="" />
          <span className="font-bold text-xl">Admin Panel</span>
        </Link>
      </div>
      <div className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === route.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
