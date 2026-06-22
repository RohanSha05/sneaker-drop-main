import { DropsPage } from "./pages/DropsPage";

function App() {
	return (
		//folder_naming_issue_updated
		<div className="min-h-screen bg-base-200">
			<div className="max-w-5xl mx-auto px-4 py-8">
				<header className="mb-8">
					<h1 className="text-3xl font-bold">Sneaker Drop</h1>
					<p className="text-base-content/60 mt-1">
						Limited edition releases — stock updates live
					</p>
				</header>
				<DropsPage />
			</div>
		</div>
	);
}

export default App;
