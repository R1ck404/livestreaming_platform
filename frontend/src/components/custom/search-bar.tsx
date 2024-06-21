import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import { Search } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState, FC } from "react";

import { useDebounce, useClickAway } from "@uidotdev/usehooks";

interface User {
    id: string;
    username: string;
}

const SearchBar: FC = () => {
    const client = createBrowserClient();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const fullRef = useClickAway(() => {
        setUsers([]);
    });

    const handleChange = (e: any) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const handleSearch = async () => {
            const search: string = searchTerm;

            if (debouncedSearchTerm == "") {
                setUsers([]);
                return;
            }

            if (debouncedSearchTerm && debouncedSearchTerm.length < 2) {
                return;
            }

            if (debouncedSearchTerm) {
                const result = await client.collection("users").getList(1, 10, { filter: `username ~ "${debouncedSearchTerm}"` });
                setUsers(result.items as unknown as User[]);
            }
        };

        if (debouncedSearchTerm) {
            handleSearch();
        }
    }, [debouncedSearchTerm]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="relative w-12 sm:w-full" ref={fullRef as any}>
            <input
                type="text"
                placeholder="Search"
                className={`bg-background text-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent focus:bg-background border-[1px] border-muted shadow-md transition-all ${users.length > 0 ? "rounded-t-xl" : "rounded-full"} w-10 sm:w-full`}
                ref={inputRef}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                onKeyUp={(e) => {
                    if (e.key === "Escape") {
                        setUsers([]);
                    } else if (e.key === "Enter") {
                        setSearchTerm(e.currentTarget.value);
                    }
                }}
            />
            <span className="absolute top-0 right-0 hidden items-center h-full mr-4 sm:flex">
                <Search size={20} />
            </span>
            {users.length > 0 && (
                <div className="absolute w-full bg-background rounded-b-xl shadow-md top-10 border z-[100] ring-1 ring-accent flex flex-col">
                    {users.map((user) => (
                        <Link key={user.id} className="px-4 py-2 border-b border-muted hover:bg-muted rounded-xl" href={"/user/" + user.username}>
                            {user.username}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
