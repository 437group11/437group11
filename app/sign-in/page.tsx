import ButtonLink from "../../components/button-link";

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
                <ButtonLink href="/feed">
                    Sign in
                </ButtonLink>
            </form>
        </>
    )
}
