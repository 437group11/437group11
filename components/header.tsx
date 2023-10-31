import Link from "next/link";
import { useRouter } from "next/router";
import { getUsername } from "utils/userManager";

const sessionUser = "example";

export default function Header() {
    const router = useRouter();
    const { pathname } = router;
    console.log(pathname);
    const username = sessionUser;
    let headerContent;
    if (pathname === "/feed") {
        if (username) {
            headerContent = (
                <header className="bg-bg-darker p-8">
                    <Link href="/feed">
                        Beatbuff
                    </Link>
                    <Link href={`/profile/${username}`} className="float-right">
                        {username} 
                    </Link>
                </header>
            );
        } else {
            headerContent = (
                <header className="bg-bg-darker p-8">
                    <Link href="/feed">
                        Beatbuff
                    </Link>
                    <p className="float-right">{username}</p>
                </header>
            );
        }
    } else if (pathname === "/profile/[username]")
    {
        headerContent = (
        <header className="bg-bg-darker p-8">
            <Link href="/feed">
                Beatbuff
            </Link>
            <Link href="/" className="float-right">
                Log Out
            </Link>
        </header>
        );
    }
    else
    {
        headerContent = (
        <header className="bg-bg-darker p-8">
            <Link href="/">
                    Beatbuff
            </Link>
        </header>
        );
    }
    return headerContent;
}
