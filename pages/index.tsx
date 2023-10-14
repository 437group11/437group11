import RootLayout from "../components/root-layout";
import ButtonLink from "../components/button-link";

export default function Home() {
    return (
        <RootLayout>
            <h1 className='text-6xl my-8'>
                Welcome to group11_website!
            </h1>
            <p className='text-xl my-8'>
                group11_website is a website where users can rate music and share their recommendations.
                To get started, create an account or sign in:
            </p>
            <div className="my-8">
                <ButtonLink href="/register">
                    Create an account
                </ButtonLink>
                <ButtonLink href="/sign-in">
                    Sign in
                </ButtonLink>
            </div>
        </RootLayout>
    )
}
