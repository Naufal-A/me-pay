

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-black  text-center sm:mx-auto sm:w-full sm:max-w-md">
        <div className="p-10 pb-6">
          <img src="/next.svg" alt="logo" />
        </div>
        <h1 className=" text-2xl font-bold  "> Me-Pay Dashboard</h1>
        <p className=" text-gray-500 "> Sign in to access your operational workspace </p>
      </div>

      <div className=" text-black sm:mx-auto sm:w-full sm:max-w-md mt-8 bg-white px-12 py-8 rounded-2xl shadow-xl">
        <div className="mb-4">
          <h2>
            Admin ID
          </h2>
          <input 
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm " 
          type="text" 
          placeholder="ID"/>
        </div>
        <div>
          <h2>
            Password
          </h2>
          <input 
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm " 
          type="text" 
          placeholder="••••••••"/>
        </div>
        <div>
          <hr className="border-t border-zinc-200 my-6" />
          <button className="border-transparent hover:bg-green-500 rounded-xl text-white px-6 py-2 bg-green-400 "> login </button>
        </div>
      </div>

    </main>
  );
}
