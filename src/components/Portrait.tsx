import { motion } from "motion/react"
import type React from "react"
import { useCallback, useRef, useState } from "react"
import { clamp, round } from "../utils/math"

interface PortraitProps {
	name: string
	imageSrc: string
	size?: "small" | "medium" | "large"
	showGlare?: boolean
	glareMaskSrc?: string
}

export function Portrait({
	name,
	imageSrc,
	size = "medium",
	showGlare = true,
	glareMaskSrc = "",
}: PortraitProps) {
	const sizeClasses = {
		small: "w-16 h-16",
		medium: "w-24 h-24",
		large: "w-64 h-84",
	}

	const ref = useRef<HTMLDivElement>(null)
	const [transform, setTransform] = useState({
		rotateX: 0,
		rotateY: 0,
		glareX: 50,
		glareY: 50,
		glareOpacity: 0,
	})

	const calcPointerFromCenter = (centerX: number, centerY: number) => {
		const distance = Math.sqrt(
			(centerX - 50) * (centerX - 50) + (centerY - 50) * (centerY - 50),
		)
		console.log(clamp(distance / 50, 0, 1))
		return clamp(distance / 50, 0, 1)
	}

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		if (!ref.current) return

		const rect = ref.current.getBoundingClientRect()
		const width = rect.width
		const height = rect.height
		const mouseX = e.clientX - rect.left
		const mouseY = e.clientY - rect.top

		// Calculate percentages (0-100)
		const percentX = clamp(round((100 / width) * mouseX))
		const percentY = clamp(round((100 / height) * mouseY))

		// Calculate center-based coordinates (-50 to 50)
		const centerX = percentX - 50
		const centerY = percentY - 50

		setTransform({
			rotateX: centerY * 0.5,
			rotateY: centerX * -0.3,
			glareX: percentX,
			glareY: percentY,
			glareOpacity: 1,
		})
	}, [])

	const handleMouseLeave = useCallback(() => {
		setTransform({
			rotateX: 0,
			rotateY: 0,
			glareX: 50,
			glareY: 50,
			glareOpacity: 0,
		})
	}, [])

	return (
		<motion.div
			ref={ref}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			animate={{
				rotateX: transform.rotateX,
				rotateY: transform.rotateY,
			}}
			transition={{
				type: "spring",
				stiffness: 700,
				damping: 30,
			}}
			style={{
				transformStyle: "preserve-3d",
				transformOrigin: "center center",
			}}
			className="portrait-container relative cursor-pointer overflow-hidden rounded-lg"
		>
			<motion.img
				src={imageSrc}
				alt={`Portrait of ${name}`}
				className={`${sizeClasses[size]} object-cover relative z-10`}
				style={{
					backfaceVisibility: "hidden",
					WebkitBackfaceVisibility: "hidden",
				}}
			/>

			{/* Glare/Shine Effect */}
			{showGlare && (
				<motion.div
					className="absolute inset-0 pointer-events-none z-20"
					animate={{
						background: `radial-gradient(farthest-side circle at ${transform.glareX}% ${transform.glareY}%, hsla(0, 0%, 100%, 0.8) 10%,
									hsla(0, 0%, 100%, 0.65) 20%,
									hsla(0, 0%, 0%, 0.5) 90%)`,
						opacity: transform.glareOpacity,
					}}
					transition={{
						type: "spring",
						stiffness: 700,
						damping: 30,
					}}
					style={{
						mixBlendMode: "overlay",
					}}
				/>
			)}

			{/* Glare/Shine Effect */}
			{showGlare && glareMaskSrc && (
				<motion.div
					className="absolute inset-0 pointer-events-none z-20"
					animate={{
						backgroundImage: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, #fff 5%, #000 50%, #fff 80% ), linear-gradient( -45deg, #000 15%, #fff, #000 85% ), url(${glareMaskSrc})`,
						opacity: `calc((1.5 * ${transform.glareOpacity}) - ${calcPointerFromCenter(transform.glareX, transform.glareY)})`,
						backgroundPosition: `center center, calc(100% * ${transform.glareX / 100}) calc(100% * ${transform.glareY / 100}), center center`,
					}}
					style={{
						backgroundBlendMode: "soft-light, difference",
						backgroundSize: "120% 120%, 200% 200%, cover",
						filter: "brightness(0.8) contrast(1.5) saturate(1)",
						mixBlendMode: "color-dodge",
					}}
				/>
			)}
		</motion.div>
	)
}

export default Portrait
