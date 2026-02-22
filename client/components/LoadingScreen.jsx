import { FaSpinner } from "react-icons/fa";

const LoadingScreen = () => (
  // "h-64" or "min-h-screen" depending on if you want it full page or just a section
  <div className="flex flex-col items-center justify-center p-10 w-full h-full">
    <FaSpinner className="animate-spin text-blue-500 text-3xl" />
    <span className="mt-2 text-sm text-gray-500 font-medium">Loading...</span>
  </div>
);

export default LoadingScreen;