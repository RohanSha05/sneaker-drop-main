import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

let socket = null;

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getSocket() {
	if (!socket) {
		socket = io(SOCKET_URL, {
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
		});
	}
	return socket;
}

export function useSocket({
	dropIds = [],
	onStockUpdated,
	onReservationExpired,
	onPurchaseConfirmed,
}) {
	const joinedRooms = useRef(new Set());
	const dropIdsKey = dropIds.join(",");

	// Keep callbacks in refs so the effect doesn't re-run when they change
	const onStockUpdatedRef = useRef(onStockUpdated);
	const onReservationExpiredRef = useRef(onReservationExpired);
	const onPurchaseConfirmedRef = useRef(onPurchaseConfirmed);

	useEffect(() => {
		onStockUpdatedRef.current = onStockUpdated;
	}, [onStockUpdated]);
	useEffect(() => {
		onReservationExpiredRef.current = onReservationExpired;
	}, [onReservationExpired]);
	useEffect(() => {
		onPurchaseConfirmedRef.current = onPurchaseConfirmed;
	}, [onPurchaseConfirmed]);

	useEffect(() => {
		const sock = getSocket();

		 sock.on("connect", () => {
				console.log("✅ Connected:", sock.id);
			});

			sock.on("disconnect", (reason) => {
				console.log("❌ Disconnected:", reason);
			});

			sock.on("connect_error", (err) => {
				console.log("🚨 Connection Error:", err.message);
			});

			const handleStockUpdated = (data) => {
				console.log("📦 stock-updated", data);
				onStockUpdatedRef.current?.(data);
			};

			const handleReservationExpired = (data) => {
				console.log("⏰ reservation-expired", data);
				onReservationExpiredRef.current?.(data);
			};

			const handlePurchaseConfirmed = (data) => {
				console.log("💰 purchase-confirmed", data);
				onPurchaseConfirmedRef.current?.(data);
			};

			sock.on("stock-updated", handleStockUpdated);
			sock.on("reservation-expired", handleReservationExpired);
			sock.on("purchase-confirmed", handlePurchaseConfirmed);

			const currentDropIds = dropIdsKey ? dropIdsKey.split(",") : [];

			currentDropIds.forEach((id) => {
				if (!joinedRooms.current.has(id)) {
					sock.emit("join-drop", id);
					joinedRooms.current.add(id);
				}
			});


		return () => {
			sock.off("stock-updated", handleStockUpdated);
			sock.off("reservation-expired", handleReservationExpired);
			sock.off("purchase-confirmed", handlePurchaseConfirmed);
		};
	}, [dropIdsKey]);
}
