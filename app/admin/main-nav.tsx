/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    {
        title: "Overview",
        href: "/admin/overview",
    },
    {
        title: "Products",
        href: "/admin/products",
    },
    {
        title: "Orders",
        href: "/admin/orders",
    },
    {
        title: "Users",
        href: "/admin/users",
    },
];

const MainNav = ({className,...props}: React.HtmlHTMLAttributes<HTMLElement>) => {
    const pathName = usePathname();
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            {links.map((link, index) => (
                <Link
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathName.includes(link.href) ? "" : "text-muted-foreground"
                    )}
                    key={link.href}
                    href={link.href}
                >
                    {link.title}
                </Link>
            ))}
        </nav>
    );
};

export default MainNav;
