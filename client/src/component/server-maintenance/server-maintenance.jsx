import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Settings } from "lucide-react";

const  ServerMaintenance = () => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-900 text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Settings className="w-16 h-16 animate-spin text-blue-400 mb-4" />
      </motion.div>
      <h1 className="text-3xl font-bold">Server Maintenance</h1>
      <p className="text-gray-700 mt-2">We're currently working on improvements. Please check back soon.</p>
      <div className="relative w-64 mt-6">
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 60 }}
          />
        </div>
      </div>
      <p className="mt-4 text-gray-700">Estimated time left: <span className="font-semibold">{seconds} sec</span></p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        className="mt-6 px-4 py-2 bg-blue-500 rounded-lg shadow-lg"
      >
        Refresh Page
      </motion.button>
    </div>
  );
}


export default ServerMaintenance;