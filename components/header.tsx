import Link from "next/link";
import { useRouter } from "next/router";


export default function header() {
    const router = useRouter();
    const { pathname } = router;

    let headerContent;
    
    if (pathname === "/feed")
    {
        headerContent = (
            <header className="bg-bg-darker p-8">
                <Link href="/feed">
                    Beatbuff
                </Link>
                <Link href="/profile" className="float-right">
                    Profile
                </Link>
            </header>
        );
    }
    
    else if (pathname === "/profile")
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
