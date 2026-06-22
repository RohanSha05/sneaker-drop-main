import { useState } from "react";
import { useCountdown } from "../hooks/useCountdown.js";
import { alertSuccess, alertError, alertWarning } from "../lib/alert.js";
import { purchaseItem, reserveItem } from "../provider/dropApiProvider.js";

export function ReserveButton({ drop, userId }) {
	const [status, setStatus] = useState("idle");
	const [expiresAt, setExpiresAt] = useState(null);
	const [reservationId, setReservationId] = useState(null);

	const handleReserve = async () => {
		setStatus("reserving");
		try {
			const data = await reserveItem({
				dropId: drop.id,
				userId,
			});
			const reservation = data?.data.reservation;
			setExpiresAt(reservation.expiresAt);
			setReservationId(reservation.id);
			setStatus("reserved");
			alertSuccess("Reserved! You have 60 seconds to complete your purchase.");
		} catch (err) {
			setStatus("idle");
			alertError(err.message);
			console.log(err);
		}
	};

	const handlePurchase = async () => {
		setStatus("purchasing");
		try {
			await purchaseItem({
				reservationId,
				userId,
			});

			setStatus("purchased");
			setExpiresAt(null);

			alertSuccess("Purchase complete! 🎉");
		} catch (err) {
			if (err.message.includes("No active reservation")) {
				setStatus("idle");
				setExpiresAt(null);
			} else {
				setStatus("reserved");
			}

			alertError(err.message);
		}
	};

	const handleExpired = () => {
		setStatus("idle");
		setExpiresAt(null);

		alertWarning("Your reservation expired. Reserve again to continue.");
	};

	/* SOLD OUT */

	if (drop.availableStock === 0 && status === "idle") {
		return (
			<button
				disabled
				className="btn w-full rounded-2xl border-0 bg-base-300 text-base-content/50"
			>
				🔥 Sold Out
			</button>
		);
	}

	/* PURCHASED */

	if (status === "purchased") {
		return (
			<button disabled className="btn btn-success w-full rounded-2xl shadow-lg">
				✓ Purchased
			</button>
		);
	}

	/* RESERVED */

	if (status === "reserved") {
		return (
			<div className="space-y-3">
				<CountdownCard expiresAt={expiresAt} onExpired={handleExpired} />

				<button
					onClick={handlePurchase}
					className="btn btn-success w-full rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl"
				>
					🚀 Complete Purchase
				</button>
			</div>
		);
	}

	/* PURCHASING */

	if (status === "purchasing") {
		return (
			<button disabled className="btn btn-success w-full rounded-2xl">
				<span className="loading loading-spinner loading-sm" />
				Processing...
			</button>
		);
	}

	/* DEFAULT */

	return (
		<button
			onClick={handleReserve}
			disabled={status === "reserving"}
			className="btn btn-primary w-full rounded-2xl border border-base-content/20 bg-base-300 text-base-content/50"
		>
			{status === "reserving" ? (
				<>
					<span className="loading loading-spinner loading-sm" />
					Reserving...
				</>
			) : (
				"Reserve Now"
			)}
		</button>
	);
}

function CountdownCard({ expiresAt, onExpired }) {
	const secondsLeft = useCountdown(expiresAt, onExpired);

	const isUrgent = secondsLeft <= 10;

	const progress = (secondsLeft / 60) * 100;

	return (
		<div
			className={`
    rounded-2xl
    border-2
    border-green-600
    p-4
    transition-all
    ${isUrgent ? "bg-error/10" : "bg-warning/10"}
  `}
		>
			<div className="flex items-center justify-between mb-3">
				<span className="text-xs font-semibold uppercase tracking-wider">
					Reservation Active
				</span>

				<span
					className={`font-mono font-bold ${
						isUrgent ? "text-error" : "text-warning"
					}`}
				>
					{secondsLeft}s
				</span>
			</div>

			<div className="h-2 bg-base-300 rounded-full overflow-hidden">
				<div
					className={`h-full transition-all duration-1000 ${
						isUrgent ? "bg-error" : "bg-warning"
					}`}
					style={{
						width: `${progress}%`,
					}}
				/>
			</div>

			<p className="text-xs text-base-content/60 mt-2">
				Complete checkout before the timer ends.
			</p>
		</div>
	);
}
