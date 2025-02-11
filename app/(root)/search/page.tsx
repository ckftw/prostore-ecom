/* eslint-disable @typescript-eslint/no-unused-vars */
import ProductCard from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { getAllCategories, getAllProducts } from "@/lib/actions/products.actions";
import Link from "next/link";
const prices = [
    {
        name: '$1 to $50',
        value: '1-50',
    },
    {
        name: '$51 to $100',
        value: '51-100',
    },
    {
        name: '$101 to $200',
        value: '101-200',
    },
    {
        name: '$201 to $500',
        value: '201-500',
    }
]
const ratings = [4,3,2,1]
const sortOrders = ['newest','lowest','highest','rating']

/* eslint-disable @typescript-eslint/no-unused-vars */
const SearchPage = async (props: {
    searchParams: Promise<{
        q?: string;
        category?: string;
        price?: string;
        rating?: string;
        sort?: string;
        page?: string;
    }>
}) => {
    const { q = 'all', category = 'all', price = 'all', rating = 'all', sort = 'newest', page = '1' } = await props.searchParams;
    //CONSTRUCT FILTER URL
    const getFilterUrl = ({
        c, s, p, r, pg
    }: { c?: string; s?: string; p?: string; r?: string; pg?: string; }) => {
        const params = { q, category, price, rating, sort, page }
        if (c) params.category = c;
        if (s) params.sort = s;
        if (p) params.price = p;
        if (r) params.rating = r;
        if (pg) params.page = pg;
        return `/search?${new URLSearchParams(params).toString()}`
    }
    const products = await getAllProducts({
        query: q,
        category,
        price,
        rating,
        page: Number(page),
        sort,
    })

    const categories = await getAllCategories();
    return (
        <div className="grid md:grid-cols-5 md:gap-5">
            <div className="filter-links">

                <div className="text-xl mb-2 mt-3">
                    Category
                </div>
                <div>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                className={`${(category == 'all' || category == "") && 'font-bold'}`}
                                href={getFilterUrl({ c: 'all' })}>
                                Any
                            </Link>
                        </li>
                        {categories.map((x) => (
                            <li key={x.category}>
                                <Link className={`${category == x.category && 'font-bold'}`}
                                    href={getFilterUrl({ c: x.category })}>
                                    {x.category}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="text-xl mb-2 mt-8">
                    Price
                </div>
                <div>
                    <ul className="space-y-1">
                        <li>
                            <Link className={`${price === 'all' && 'font-bold'}`}
                                href={getFilterUrl({ p: 'all' })}>
                                All
                            </Link>
                        </li>
                        {prices.map((x) => (
                            <li key={x.name}>
                                <Link className={`${price === x.value && 'font-bold'}`}
                                    href={getFilterUrl({ p: x.value })}>
                                    {x.name}
                                </Link>
                            </li>
                        ))}

                    </ul>
                </div>

                {/*RATING */}
                <div className="text-xl mb-2 mt-8">
                    Customer Ratings
                </div>
                <div>
                    <ul className="space-y-1">
                        <li>
                            <Link className={`${rating === 'all' && 'font-bold'}`}
                                href={getFilterUrl({ r: 'all' })}>
                                All
                            </Link>
                        </li>
                        {ratings.map((r) => (
                            <li key={r}>
                                <Link className={`${rating === r.toString() && 'font-bold'}`}
                                    href={getFilterUrl({ r: `${r}` })}>
                                    {`${r} stars & up`}
                                </Link>
                            </li>
                        ))}

                    </ul>
                </div>
            </div>
            <div className="md:col-span-4 space-y-4">
                <div className="flex-between flex-col md:flex-row my-4">
                    <div className="flex items-center">
                        {q!=='all' && q!=='' && 'Query:' +q}
                        {category!=='all' && category!=='' && ' Category:' +category}
                        {price!=='all' && ' Price:'  + price}
                        {rating!=='all' && ' Rating:' +rating+ 'stars & up'}
                        &nbsp;
                        {
                            (q!=='all' && q!=='') || 
                            (category!=='all' && category!=='') || 
                            rating!=='all' || 
                            (price!=='all') ? (
                                <Button variant={'link'} asChild>
                                    <Link href={'/search'}>Clear</Link>
                                </Button>
                            ):null

                        }
                    </div>

                    <div>
                        Sort By {' '}
                        {sortOrders.map((s)=>(
                            <Link key={s} className={`mx-2 ${sort==s && 'font-bold'}`} href={getFilterUrl({
                                s:s
                            })}>
                                {s}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {products.data.length === 0 && (
                        <div>No Products Found....</div>
                    )}
                    {products.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;