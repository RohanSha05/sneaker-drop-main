import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "../hooks/useSocket.js";
import { DropCard } from "../components/DropCard.jsx";
import { fetchDrops, fetchUsers } from "../provider/dropApiProvider.js";

// const CURRENT_USER_ID = "e09afff9-e6ed-4277-8e07-826d8c6cadec";

export default function DropsPage() {
	const [dropUpdates, setDropUpdates] = useState({});
	const [currentUserId, setCurrentUserId] = useState("");

	const {
		data = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["drops"],
		queryFn: fetchDrops,
	});

	const { data: users = [] } = useQuery({
		queryKey: ["users"],
		queryFn: fetchUsers,
	});

const updateDrop = (dropId, changes) => {
	if (!dropId) {
		console.warn("[updateDrop] called with no dropId, skipping");
		return;
	}
	setDropUpdates((prev) => ({
		...prev,
		[dropId]: { ...prev[dropId], ...changes },
	}));
};

const drops = data.map((drop) => ({
	...drop,
	...dropUpdates[drop.id],
}));

useSocket({
	dropIds: drops.map((d) => d.id),

	onStockUpdated: (data) => {
		const dropId = data.id || data.dropId;
		if (!dropId) return;
		updateDrop(dropId, {
			availableStock: data.availableStock,
			status: data.status,
		});
	},

	onReservationExpired: (data) => {
		const dropId = data.id || data.dropId;
		if (!dropId) return;
		updateDrop(dropId, {
			availableStock: data.availableStock,
			status: data.availableStock > 0 ? "ACTIVE" : "SOLD_OUT",
		});
	},

	onPurchaseConfirmed: (data) => {
		const dropId = data.dropId;
		if (!dropId) return;
		if (data.topPurchasers) {
			updateDrop(dropId, { recentPurchasers: data.topPurchasers });
			return;
		}
		const username = data.user?.username;
		if (!username) return;
		setDropUpdates((prev) => {
			const existing = prev[dropId]?.recentPurchasers || [];
			return {
				...prev,
				[dropId]: {
					...prev[dropId],
					recentPurchasers: [username, ...existing].slice(0, 3),
				},
			};
		});
	},
});
	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-10">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className="h-80 rounded-3xl bg-base-200 animate-pulse"
						/>
					))}
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="max-w-md mx-auto mt-20">
				<div className="alert alert-error shadow-lg">
					<span>{error.message}</span>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-base-100 via-base-100 to-base-200">
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />

				<div className="relative max-w-7xl mx-auto px-4 py-16">
					<div className="text-center">
						<div className="badge badge-primary badge-lg mb-4">LIVE DROPS</div>

						<h1 className="text-4xl md:text-6xl font-black tracking-tight">
							Limited Edition
							<span className="block text-primary">Product Drops</span>
						</h1>

						<p className="mt-6 max-w-2xl mx-auto text-base-content/70 text-lg">
							Reserve and purchase exclusive releases in real-time. Inventory
							updates instantly through live WebSocket events.
						</p>
					</div>
				</div>
			</section>

			<div className="max-w-7xl mx-auto px-4 -mt-6 mb-6">
				<div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
					<h3 className="text-lg font-bold mb-3">Select Current User</h3>

					<select
						className="select select-bordered w-full md:w-1/2"
						value={currentUserId}
						onChange={(e) => setCurrentUserId(e.target.value)}
					>
						<option value="" disabled>
							Choose a user
						</option>

						{users.map((user) => (
							<option key={user.id} value={user.id}>
								{user.username || user.email || user.id}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 -mt-4">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm">
						<p className="text-sm text-base-content/60">Active Drops</p>
						<p className="text-3xl font-bold">{drops.length}</p>
					</div>

					<div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm">
						<p className="text-sm text-base-content/60">Available Stock</p>
						<p className="text-3xl font-bold">
							{drops.reduce((sum, drop) => sum + (drop.availableStock || 0), 0)}
						</p>
					</div>

					<div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm">
						<p className="text-sm text-base-content/60">Live Updates</p>
						<p className="text-3xl font-bold text-success">ON</p>
					</div>

					<div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm">
						<p className="text-sm text-base-content/60">Status</p>
						<p className="text-3xl font-bold text-primary">ACTIVE</p>
					</div>
				</div>
			</div>

			{drops.length === 0 ? (
				<div className="max-w-xl mx-auto px-4 py-24">
					<div className="bg-base-100 rounded-3xl border border-base-300 p-10 text-center shadow-lg">
						<div className="text-6xl mb-4">📦</div>

						<h2 className="text-2xl font-bold">No Drops Available</h2>

						<p className="text-base-content/60 mt-2">
							New releases will appear here when they're created.
						</p>
					</div>
				</div>
			) : (
				<div className="max-w-7xl mx-auto px-4 py-10">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-3xl font-bold">Available Drops</h2>
							<p className="text-base-content/60 mt-1">
								Real-time inventory and purchase tracking
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
						{drops.map((drop) => (
							<div
								key={drop.id}
								className="transition duration-300 hover:-translate-y-1"
							>
								<DropCard drop={drop} userId={currentUserId} />
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
