export default function SignIn() {
    return (
        <>
            <h1 className="text-4xl my-4">Sign in</h1>

            <form className="mt-8">
                <div className="mb-4">
                    <label className="block">
                        Username:
                    </label>
                    <input className="rounded-sm border-gray-300 border-2" type="text" required autoFocus />
                </div>

                <div className="my-4">
                    <label className="block">
                        Password:
                    </label>
                    <input className="rounded-sm border-gray-300 border-2" type="password" required />
                </div>

                <button type="submit" className="p-4 bg-accent-brown text-white py-2 rounded-md hover:bg-accent-brown-darker focus:outline-none focus:ring-4 focus:ring-accent-blue">Sign in</button>
            </form>
        </>
    )
}
