import { getAllCategories } from "@/lib/actions/products.actions";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const CategoryDrawer = async () => {
    const categories = await getAllCategories();
    return (
        <div>
            <Drawer direction="left">
                <DrawerTrigger asChild>
                    <Button variant={'outline'}>
                        <MenuIcon />
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="h-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Select a category</DrawerTitle>
                        <div className="space-y-1 mt-4">
                            {categories.map((category) => (
                                <Button asChild
                                    key={category.category}
                                    variant={'ghost'}
                                    className="w-full justify-start">
                                    <DrawerClose asChild>
                                        <Link href={`/search?category=${category.category}`}>
                                            {category.category} ({category._count})
                                        </Link>
                                    </DrawerClose>
                                </Button>
                            ))}
                        </div>
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export default CategoryDrawer;