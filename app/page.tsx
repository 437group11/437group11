import Main from "../components/main"

export default function Home() {
    return (
        <>
            <Main>
                <h1 className='text-6xl my-4'>
                    Welcome to group11_website!
                </h1>
                <p className='text-xl my-4'>
                    group11_website is a website where users can rate music and share their recommendations.
                    To get started, create an account or sign in:
                </p>
                <div className="my-4">
                    <a href="create-an-account" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Create an account
                    </a>
                    <a href="#" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Sign in
                    </a>
                </div>
            </Main>
        </>
    )
}
