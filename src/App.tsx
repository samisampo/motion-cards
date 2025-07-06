import { useEffect, useState } from "react"
import placeholderImage from "./assets/placeholder.jpg"
import glareMask from "./assets/wave.png"
import Portrait from "./components/Portrait"
import "./App.css"
import MobilePortrait from "./components/MobilePortrait"

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
	const [mobile, setMobile] = useState(true)

	// Check if device is mobile
	useEffect(() => {
		const checkMobile = isMobile()
		setMobile(checkMobile)
	}, [])

	const PortraitComponent = mobile ? MobilePortrait : Portrait

	return (
		<>
			{/* Employee Portrait Section */}
			<div className="portrait-section mb-8">
				<h2 className="text-xl font-bold mb-4 text-center">Our Team</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-6xl mx-auto px-4">
					<PortraitComponent
						name="Placeholder"
						imageSrc={darkTestImage}
						size="large"
						glareMaskSrc={glareMask}
					/>
					<PortraitComponent
						name="Placeholder"
						imageSrc={darkTestImage}
						size="large"
					/>
					<PortraitComponent
						name="Placeholder"
						imageSrc={placeholderImage}
						size="large"
						glareMaskSrc={glareMask}
					/>
				</div>
			</div>
		</>
	)
}

export default App
