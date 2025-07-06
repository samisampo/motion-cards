import { motion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { clamp } from "../utils/math"

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
	const [debugValues, setDebugValues] = useState({
		beta: 0,
		gamma: 0,
	})

	// Handle device orientation changes
	const handleDeviceOrientation = useCallback(
		(event: DeviceOrientationEvent) => {
			// Get orientation values
			const { beta, gamma } = event // beta: front-back tilt, gamma: left-right tilt
			console.log(event)
			setDebugValues({ beta: beta ?? 0, gamma: gamma ?? 0 })
			if (beta !== null && gamma !== null) {
				// Convert orientation to rotation values
				// beta ranges from -180 to 180 (front-back tilt)
				// gamma ranges from -90 to 90 (left-right tilt)

				// Normalize and scale the values
				const normalizedBeta = clamp(((beta + 180) / 360) * 100) // 0-100
				const normalizedGamma = clamp(((gamma + 90) / 180) * 100) // 0-100

				// Calculate rotation (inverted for natural feel)
				const rotateX = (normalizedBeta - 50) * 0.3 // Reduced sensitivity
				const rotateY = (normalizedGamma - 50) * -0.5 // Reduced sensitivity

				setTransform({
					rotateX,
					rotateY,
					glareX: normalizedGamma,
					glareY: normalizedBeta,
					glareOpacity: 0.8, // Constant opacity for gyroscope
				})
			}
		},
		[],
	)

	// Set up device orientation listener
	useEffect(() => {
		window.addEventListener("deviceorientation", handleDeviceOrientation)

		return () => {
			window.removeEventListener("deviceorientation", handleDeviceOrientation)
		}
	}, [handleDeviceOrientation])

	const calcPointerFromCenter = (centerX: number, centerY: number) => {
		const distance = Math.sqrt(
			(centerX - 50) * (centerX - 50) + (centerY - 50) * (centerY - 50),
		)
		return clamp(distance / 50, 0, 1)
	}

	return (
		<motion.div
			ref={ref}
			animate={{
				rotateX: transform.rotateX,
				rotateY: transform.rotateY,
			}}
			transition={{
				type: "spring",
				stiffness: 400, // Optimized for mobile
				damping: 40,
			}}
			style={{
				transformStyle: "preserve-3d",
				transformOrigin: "center center",
			}}
			className="portrait-container relative overflow-hidden rounded-lg touch-none"
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
			<div className="absolute bottom-0 left-0 right-0 text-white text-center p-4 z-30">
				<p>Beta: {debugValues.beta}</p>
				<p>Gamma: {debugValues.gamma}</p>
			</div>
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
						stiffness: 400,
						damping: 40,
					}}
					style={{
						mixBlendMode: "overlay",
					}}
				/>
			)}

			{/* Glare/Shine Effect with Mask */}
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
