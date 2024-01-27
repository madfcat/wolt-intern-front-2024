import "./App.css";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
	cartValue: z
		.number({ invalid_type_error: "Cart value field is required." })
		.min(0, { message: "Cart value should be at least 0" })
		.multipleOf(0.01),
	deliveryDistance: z
		.number({ invalid_type_error: "Delivery distance field is required." })
		.min(0, { message: "Delivary distance should be at least 0" }),
	amountOfItems: z
		.number({ invalid_type_error: "Amount of items field is required." })
		.min(1, { message: "Amount of items should be at least 1" }),
	time: z.date(),
});

type FormData = z.infer<typeof schema>;

function App() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({ resolver: zodResolver(schema) });

	const calcualteFee = (data: FormData) => {
		// let fee = 2; // first 100km is 2 euro, base fee

		console.log(data);
/* 		if (data.cartValue < 10)
		{
			fee += 10 - data.cartValue;
		}
		if (data.deliveryDistance > 1000)
		{
			fee += Math.ceil((data.deliveryDistance - 1000) / 500); // add 1 euro for each 500 meters
		} */
	};

	return (
		<div className="app">
			<div className="fee-calculator">
				<form onSubmit={handleSubmit(calcualteFee)}>
					<fieldset>
						<legend>Delivery Fee Calculator</legend>
						<div className="input-fields">
							<div className="input-field cart-value-container">
								<label htmlFor="cart-value" className="form-label">
									Cart value
								</label>
								<input
									{...register("cartValue", { valueAsNumber: true })}
									id="cart-value"
									type="number"
									data-test-id="cartValue"
									step="0.01"
								/>
							</div>
							{errors.cartValue && <div>{errors.cartValue.message}</div>}
							<div className="input-field delivery-distance-container">
								<label htmlFor="delivery-distance" className="form-label">
									Delivery distance
								</label>
								<input
									{...register("deliveryDistance", { valueAsNumber: true })}
									id="delivery-distance"
									type="number"
									data-test-id="deliveryDistance"
									min="0"
								/>
							</div>
							{errors.deliveryDistance && (
								<div>{errors.deliveryDistance.message}</div>
							)}
							<div className="input-field amount-of-items-container">
								<label htmlFor="amount-of-items" className="form-label">
									Amount of items
								</label>
								<input
									{...register("amountOfItems", { valueAsNumber: true })}
									id="amount-of-items"
									type="number"
									data-test-id="amountOfItems"
									onChange={(e) => console.log()}
								/>
							</div>
							{errors.amountOfItems && (
								<div>{errors.amountOfItems.message}</div>
							)}
							<div className="input-field time-container">
								<label htmlFor="time" className="form-label">
									Amount of items
								</label>
								<input
									{...register("time", { valueAsDate: true })}
									id="time"
									type="datetime-local"
									data-test-id="time"
								/>
							</div>
							{errors.time && <div>{errors.time.message}</div>}
							<div className="input-field ">
								<button type="submit">Calculate delivery price</button>
							</div>
							<div>Delivery price: {0}€</div>
						</div>
					</fieldset>
				</form>
			</div>
		</div>
	);
}

export default App;
