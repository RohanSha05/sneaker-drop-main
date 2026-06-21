import { useState, useEffect, useRef } from "react";

const calculateSecondsLeft = (expiresAt) => {
	if (!expiresAt) return 0;
	return Math.max(0, Math.floor((new Date(expiresAt) - Date.now()) / 1000));
};

/**
 * Returns seconds remaining until expiresAt.
 * Calls onExpired once when it hits zero.
 */
export function useCountdown(expiresAt, onExpired) {
	const [secondsLeft, setSecondsLeft] = useState(() =>
		calculateSecondsLeft(expiresAt),
	);
	const onExpiredRef = useRef(onExpired); // stable ref so effect doesn't re-run

	// Keep ref in sync without re-triggering the effect
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
	}, [expiresAt]); // only re-runs if expiresAt changes

	return secondsLeft;
}
