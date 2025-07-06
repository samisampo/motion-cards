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
	rainbowMaskSrc?: string
}

export function Portrait({
	name,
	imageSrc,
	size = "medium",
	showGlare = true,
	glareMaskSrc = "",
	rainbowMaskSrc = "",
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
						background: `radial-gradient(farthest-side circle at ${transform.glareX}% ${transform.glareY}%, hsla(0, 0%, 100%, 0.8) 10%, hsla(0, 0%, 100%, 0.5) 20%, hsla(0, 0%, 0%, 0.75) 90% )`,
						opacity: transform.glareOpacity,
					}}
					transition={{
						type: "spring",
						stiffness: 700,
						damping: 30,
					}}
					style={{
						mixBlendMode: "overlay",
						filter: "brightness(0.7) contrast(1.5) blur(180px)",
					}}
				/>
			)}

			{/* Glare/Shine Effect */}
			{showGlare && glareMaskSrc && (
				<motion.div
					className={`absolute inset-0 pointer-events-none z-20 ${
						rainbowMaskSrc ? "rainbow-glare" : ""
					}`}
					animate={{
						backgroundImage: ` url(${glareMaskSrc}),  url(${glareMaskSrc}), radial-gradient( farthest-corner circle at ${transform.glareX}% ${transform.glareY}%, hsla(150, 20%, 10%, 1) 10%, hsla(177, 22%, 80%, 0.1) 50%, hsla(0, 0%, 95%, .98) 90% )`,
						opacity: `calc((1.5 * ${transform.glareOpacity}) - ${calcPointerFromCenter(transform.glareX, transform.glareY)})`,
					}}
					style={{
						backgroundPosition: `40% 45%, 55% 55%, center center`,
						backgroundBlendMode: "soft-light, color-burn",
						backgroundSize: "25% 25%, 25% 25%, cover",
						filter: "brightness(1) contrast(1) saturate(0.9)",
						mixBlendMode: "color-dodge",
						// @ts-ignore
						"--rainbow-mask": `url(${rainbowMaskSrc})`,
						"--background-x": `${transform.glareX}`,
						"--background-y": `${transform.glareY}`,
						"--pointer-from-center": `${calcPointerFromCenter(
							transform.glareX,
							transform.glareY,
						)}`,
						"--glare-mask": `url(${glareMaskSrc})`,
						"--pointer-x": `${transform.glareX}`,
						"--pointer-y": `${transform.glareY}`,
						display: "grid",
						gridArea: "1 / 1",
						// ":before": {
						// 	content: '""',
						// 	position: "absolute",
						// 	inset: 0,
						// 	background:
						// 		"repeating-linear-gradient(133deg, rgb(216, 117, 255) 5%, rgb(255, 122, 117) 10%, rgb(255, 237, 97) 15%, rgb(168, 255, 97) 20%, rgb(133, 255, 247) 25%, rgb(122, 149, 255) 30%, rgb(216, 117, 255) 35%)",
						// },
					}}
				/>
			)}
		</motion.div>
	)
}

export default Portrait
