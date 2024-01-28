import "./App.css";
import FeeCalculator from "./FeeCalculator";


function App() {
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	const currentTime = now.toISOString().slice(0, 16);

	return (
		<div className="app">
			<FeeCalculator 
				cartValueDefault={20.00}
				deliveryDistanceDefault={2235}
				amountOfItemsDefault={4}
				timeDefault={currentTime}
			/>
		</div>
	);
}

export default App;
