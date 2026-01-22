"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { height: 32, className: "h-8" },
    md: { height: 48, className: "h-12" },
    lg: { height: 64, className: "h-16" },
  }

  const currentSize = sizes[size]

  return (
    <motion.div
      className="flex items-center"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className={`relative ${currentSize.className} w-auto`}>
        <Image
          src="/logo-koneex-new.png"
          alt="Koneex Travel"
          width={currentSize.height * 2.5}
          height={currentSize.height}
          className="object-contain h-full w-auto"
          priority
        />
      </div>
    </motion.div>
  )
}
