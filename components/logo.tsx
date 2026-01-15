"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { width: 80, height: 40 },
    md: { width: 120, height: 60 },
    lg: { width: 160, height: 80 },
  }

  const currentSize = sizes[size]

  return (
    <motion.div
      className="flex items-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Image
        src="/logob.png"
        alt="koneex Agencia de Viajes"
        width={currentSize.width}
        height={currentSize.height}
        className="object-contain"
        priority
      />
    </motion.div>
  )
}
