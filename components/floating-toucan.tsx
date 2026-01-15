"use client"

import { motion } from "framer-motion"

export function FloatingToucan() {
  return (
    <motion.div
      className="fixed bottom-24 left-4 z-40 text-6xl cursor-pointer hidden md:block"
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.2, rotate: 15 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
    >
      🦜
    </motion.div>
  )
}
