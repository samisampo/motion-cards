export const clamp = (value: number, min = 0, max = 100): number => {
	return Math.max(min, Math.min(max, value))
}

export const round = (value: number): number => {
	return Math.round(value)
}
