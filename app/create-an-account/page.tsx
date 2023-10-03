export default function CreateAnAccount() {
    return (
        <>
            <h1>Create an account</h1>

            <form className="mt-8">
                <div className="mb-4">
                    <label className="block">
                        Username:
                    </label>
                    <input className="rounded-sm border-gray-300 border-2" type="text" required autoFocus />
                </div>

                <div className="my-4">
                    <label className="block">
                        Email:
                    </label>
                    <input className="rounded-sm border-gray-300 border-2" type="text" required />
                </div>

                <div className="my-4">
                    <label className="block">
                        Password:
                    </label>
                    <input className="rounded-sm border-gray-300 border-2" type="text" required />
                </div>

                <div className="my-4">
                    <label className="block">
                        Confirm password:
                    </label>
                    <input className="rounded-sm border-gray-300 border-2" type="text" required />
                </div>

                <button type="submit" className="p-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">Create</button>
            </form>
        </>
    )
}
