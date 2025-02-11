/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAllCategories } from "@/lib/actions/products.actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";

const Search = async () => {
    const categories = await getAllCategories();
    return (
        <div>
            <form action="/search" method="GET">
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Select name="category">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder='All' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" key='All'>All</SelectItem>
                            {categories.map((x) => (
                                <SelectItem value={x.category} key={x.category}>{x.category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input name="q"
                        type="text"
                        placeholder="Search..."
                        className="md:w-[100px] lg:w-[300px]"
                    />
                    <Button>
                        <SearchIcon />
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Search