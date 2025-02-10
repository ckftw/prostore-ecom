/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const AdminSearch = () => {
    const pathname = usePathname();
    const formActionUrl = pathname.includes("/admin/orders")
        ? "/admin/orders"
        : pathname.includes("/admin/users")
            ? "/admin/users"
            : "/admin/products";

    const searchParams = useSearchParams();
    const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

    useEffect(() => {
        setQueryValue(searchParams.get("query") || "");
    }, [searchParams]);

    return (
        <div>
            <form action={formActionUrl} method="GET">
                <Input
                    type="search"
                    placeholder="Search..."
                    name="query"
                    value={queryValue}
                    onChange={(e) => setQueryValue(e.target.value)}
                    className="md:w-[100px] lg:w-[300px]"
                />

                <Button className="sr-only" type="submit">Search</Button>
            </form>
        </div>
    );
};

export default AdminSearch;
