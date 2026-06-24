import { useState, useEffect, useRef } from "react";

const calculateSecondsLeft = (expiresAt) => {
	if (!expiresAt) return 0;
	return Math.max(0, Math.floor((new Date(expiresAt) - Date.now()) / 1000));
};

export default function useCountdown(expiresAt, onExpired) {
	const [secondsLeft, setSecondsLeft] = useState(() =>
		calculateSecondsLeft(expiresAt),
	);
	const onExpiredRef = useRef(onExpired);
	useEffect(() => {
		onExpiredRef.current = onExpired;
	}, [onExpired]);

	useEffect(() => {
		const updateCountdown = () => {
			const remaining = calculateSecondsLeft(expiresAt);
			setSecondsLeft(remaining);

			if (expiresAt && remaining === 0) {
				onExpiredRef.current?.();
			}

			return remaining;
		};

		let interval;
		const initialUpdate = setTimeout(() => {
			const remaining = updateCountdown();
			if (remaining === 0) {
				clearInterval(interval);
			}
		}, 0);

		interval = setInterval(() => {
			const remaining = updateCountdown();

			if (remaining === 0) {
				clearInterval(interval);
			}
		}, 1000);

		return () => {
			clearTimeout(initialUpdate);
			clearInterval(interval);
		};
	}, [expiresAt]); 

	return secondsLeft;
}
