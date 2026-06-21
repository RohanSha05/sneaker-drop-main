import { ReserveButton } from "./ReserveButton";

export function DropCard({ drop, userId }) {
	const stockPercentage = (drop.availableStock / drop.totalStock) * 100;

	const stockColor =
		drop.availableStock === 0
			? "bg-error"
			: drop.availableStock <= 3
				? "bg-warning"
				: "bg-success";

	return (
		<div className="group relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-md transition-all duration-300">
			{/* Glow Effect */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

			<div className="relative p-6">
				{/* Top Section */}
				<div className="flex items-start justify-between gap-3">
					<div>
						<div className="badge badge-outline badge-sm mb-3">LIVE DROP</div>

						<h2 className="text-xl font-bold tracking-tight">{drop.title}</h2>

						<p className="text-sm text-base-content/60 mt-1">
							Limited release item
						</p>
					</div>

					<div
						className={`badge ${
							drop.availableStock === 0
								? "badge-error"
								: drop.availableStock <= 3
									? "badge-warning"
									: "badge-success"
						}`}
					>
						{drop.availableStock === 0
							? "Sold Out"
							: `${drop.availableStock} Left`}
					</div>
				</div>

				{/* Divider */}
				<div className="divider my-5" />

				{/* Stock Stats */}
				<div className="space-y-3">
					<div className="flex justify-between text-sm">
						<span className="text-base-content/60">Available Stock</span>
						<span className="font-semibold">
							{drop.availableStock}/{drop.totalStock}
						</span>
					</div>

					<div className="h-2 rounded-full bg-base-300 overflow-hidden">
						<div
							className={`h-full transition-all duration-500 ${stockColor}`}
							style={{
								width: `${stockPercentage}%`,
							}}
						/>
					</div>
				</div>

				{/* Description */}
				{drop.description && (
					<p className="mt-5 text-sm text-base-content/70 leading-relaxed">
						{drop.description}
					</p>
				)}

				{/* Purchasers */}
				<div className="mt-5 rounded-2xl bg-base-200/70 p-4">
					<p className="text-xs uppercase tracking-wider text-base-content/50 mb-2">
						Recent Purchasers
					</p>

					{drop.recentPurchasers?.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{drop.recentPurchasers.slice(0, 3).map((user) => (
								<span key={user} className="badge badge-outline">
									{user}
								</span>
							))}
						</div>
					) : drop.purchases?.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{drop.purchases.slice(0, 3).map((purchase) => (
								<span key={purchase.id} className="badge badge-outline">
									{purchase.user.username}
								</span>
							))}
						</div>
					) : (
						<p className="text-sm text-base-content/50">No purchases yet</p>
					)}
				</div>

				{/* Footer */}
				<div className="mt-6">
					<ReserveButton drop={drop} userId={userId} />
				</div>
			</div>
		</div>
	);
}
