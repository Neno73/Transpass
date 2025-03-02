export default function TestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold">TransPass Deployment Test Page</h1>
      <p className="mt-4 text-lg">If you can see this page, the deployment is working!</p>
      <p className="mt-2 text-gray-600">Version: v1</p>
      <a href="/" className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Go to Home Page
      </a>
    </div>
  );
}