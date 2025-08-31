import { auth } from "@/auth";
import ClientSession from "@/components/ClientSession";

export default async function SessionPage() {
  const session = await auth();
  return (
    <div className="flex flex-row justify-around mt-20 gap-6">
      <div className="bg-green-50 p-10 rounded-xl shadow-lg w-1/2 overflow-auto">
        <h3 className="text-3xl font-bold">Server session data:</h3>
        {session ? (
          <div>
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>
        ) : (
          <div>
            <p>Sign in to see who you have liked and who has liked you</p>
          </div>
        )}
      </div>
      <ClientSession />
    </div>
  );
}
