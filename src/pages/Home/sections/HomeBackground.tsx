import { motion } from "framer-motion";

export const HomeBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
      transition={{ duration: 15, repeat: Infinity }}
      className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
    />
    <motion.div
      animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
      transition={{ duration: 18, repeat: Infinity }}
      className="absolute right-0 top-20 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl"
    />
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 10, repeat: Infinity }}
      className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"
    />
  </div>
);

export default HomeBackground;
