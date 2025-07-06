import { useEffect, useState } from "react"
import placeholderImage from "./assets/placeholder.jpg"
import glareMask from "./assets/wave.png"
import Portrait from "./components/Portrait"
import "./App.css"
import diamondMask from "./assets/diamond.png"
import diamondMaskBg from "./assets/diamond-bg.png"
import diamondInvertedMask from "./assets/diamond-inverted.png"
import diamondInvertedMaskBg from "./assets/diamond-inverted-bg.png"
import glitterMask from "./assets/glitter.png"
import MobilePortrait from "./components/MobilePortrait"
import RainbowPortrait from "./components/RainbowPortrait"

const darkTestImage =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23111111'/%3E%3C/svg%3E"

// Check if device is mobile
const isMobile = (): boolean => {
	return (
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent,
		) || window.innerWidth <= 768
	)
}

function App() {
	const [mobile, setMobile] = useState(false)
	const [currentPortraitIndex, setCurrentPortraitIndex] = useState(0)

	// Check if device is mobile
	useEffect(() => {
		const checkMobile = isMobile()
		setMobile(checkMobile)
	}, [])

	const portraits = [
		{
			name: "Placeholder",
			imageSrc: darkTestImage,
			glareMaskSrc: glareMask,
		},
		{
			name: "Placeholder",
			imageSrc: darkTestImage,
			glareMaskSrc: diamondMaskBg,
		},
		{
			name: "Placeholder",
			imageSrc: darkTestImage,
		},
		{
			name: "Placeholder",
			imageSrc: placeholderImage,
			glareMaskSrc: glareMask,
		},
		{
			name: "Placeholder",
			imageSrc: placeholderImage,
			glareMaskSrc: diamondMask,
		},
		{
			name: "Placeholder",
			imageSrc: placeholderImage,
			glareMaskSrc: diamondInvertedMask,
		},
		{
			name: "Placeholder",
			imageSrc: placeholderImage,
			glareMaskSrc: diamondInvertedMaskBg,
		},
		{
			name: "Placeholder",
			imageSrc: placeholderImage,
			glareMaskSrc: diamondMaskBg,
		},
	]

	const rainbowPortraits = [
		{
			name: "Placeholder",
			imageSrc: placeholderImage,
			glareMaskSrc: glitterMask,
			rainbowMaskSrc: glitterMask,
		},
		{
			name: "Placeholder",
			imageSrc: darkTestImage,
			glareMaskSrc: glitterMask,
			rainbowMaskSrc: glitterMask,
		},
	]

	const handleSwipe = (direction: "left" | "right") => {
		if (direction === "left" && currentPortraitIndex < portraits.length - 1) {
			setCurrentPortraitIndex(currentPortraitIndex + 1)
		} else if (direction === "right" && currentPortraitIndex > 0) {
			setCurrentPortraitIndex(currentPortraitIndex - 1)
		}
	}

	if (mobile) {
		return (
			<div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
				<div className="w-full h-full relative">
					<MobilePortrait
						name={portraits[currentPortraitIndex].name}
						imageSrc={portraits[currentPortraitIndex].imageSrc}
						size="fullscreen"
						glareMaskSrc={portraits[currentPortraitIndex].glareMaskSrc}
					/>

					{/* Navigation dots */}
					<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
						{portraits.map((portrait, index) => (
							<button
								type="button"
								key={portrait.name}
								onClick={() => setCurrentPortraitIndex(index)}
								className={`w-3 h-3 rounded-full transition-colors ${
									index === currentPortraitIndex ? "bg-white" : "bg-white/50"
								}`}
							/>
						))}
					</div>

					{/* Swipe navigation */}
					<div className="absolute inset-0 flex">
						<button
							type="button"
							onClick={() => handleSwipe("right")}
							className="w-1/2 h-full opacity-0"
							disabled={currentPortraitIndex === 0}
						/>
						<button
							type="button"
							onClick={() => handleSwipe("left")}
							className="w-1/2 h-full opacity-0"
							disabled={currentPortraitIndex === portraits.length - 1}
						/>
					</div>
				</div>
			</div>
		)
	}

	return (
		<>
			{/* Employee Portrait Section */}
			<div className="portrait-section mb-8">
				<h2 className="text-xl font-bold mb-4 text-center">Our Team</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-6xl mx-auto px-4">
					{portraits.map((portrait) => (
						<Portrait
							key={portrait.name}
							name={portrait.name}
							imageSrc={portrait.imageSrc}
							size="large"
							glareMaskSrc={portrait.glareMaskSrc}
						/>
					))}
					{rainbowPortraits.map((portrait) => (
						<RainbowPortrait
							key={portrait.name}
							name={portrait.name}
							imageSrc={portrait.imageSrc}
							size="large"
							glareMaskSrc={portrait.glareMaskSrc}
							rainbowMaskSrc={portrait.rainbowMaskSrc}
						/>
					))}
				</div>
			</div>
		</>
	)
}

export default App
