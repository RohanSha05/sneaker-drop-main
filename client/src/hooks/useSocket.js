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

		const handleStockUpdated = (data) => onStockUpdatedRef.current?.(data);
		const handleReservationExpired = (data) =>
			onReservationExpiredRef.current?.(data);
		const handlePurchaseConfirmed = (data) =>
			onPurchaseConfirmedRef.current?.(data);
		const currentDropIds = dropIdsKey ? dropIdsKey.split(",") : [];
		const joinDropRooms = () => {
			currentDropIds.forEach((id) => {
				if (!joinedRooms.current.has(id)) {
					sock.emit("join-drop", id);
					joinedRooms.current.add(id);
				}
			});
		};
		sock.onAny((eventName, data) => {
			console.log("[Socket] Event received:", eventName, data);
		});
		const handleConnect = () => {
			joinedRooms.current.clear();
			joinDropRooms();
		};

		sock.on("connect", handleConnect);
		sock.on("stock-updated", handleStockUpdated);
		sock.on("reservation-expired", handleReservationExpired);
		sock.on("purchase-confirmed", handlePurchaseConfirmed);
		sock.on("purchase-created", handlePurchaseConfirmed);

		joinDropRooms();

		return () => {
			sock.off("connect", handleConnect);
			sock.off("stock-updated", handleStockUpdated);
			sock.off("reservation-expired", handleReservationExpired);
			sock.off("purchase-confirmed", handlePurchaseConfirmed);
			sock.off("purchase-created", handlePurchaseConfirmed);
		};
	}, [dropIdsKey]);
}
