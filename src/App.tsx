import "./App.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
	cartValue: z
		.number({ invalid_type_error: "Cart value field is required." })
		.min(0, { message: "Cart value should be at least 0." })
		.multipleOf(0.01),
	deliveryDistance: z
		.number({ invalid_type_error: "Delivery distance field is required." })
		.min(0, { message: "Delivary distance should be at least 0." }),
	amountOfItems: z
		.number({ invalid_type_error: "Amount of items field is required." })
		.min(1, { message: "Amount of items should be at least 1." }),
	time: z
		.date({
			errorMap: (issue, { defaultError }) => ({
				message:
					issue.code === "invalid_date" ? "Date is not valid." : defaultError,
			}),
		})
		.min(new Date(new Date().getTime() - 60 * 1000), {
			message: "Please, select current time or later.",
		}),
});

type FormData = z.infer<typeof schema>;

function App() {
	const {
		// control,
		register,
		handleSubmit,
		// getValues,
		formState: { errors },
	} = useForm<FormData>({ resolver: zodResolver(schema) });

	console.log(errors);
	const [deliveryFee, setDeliveryFee] = useState(0);

	const calcualteFee = (data: FormData) => {
		let res = 2; // first 100km is 2 euro, base fee
		if (data.cartValue < 10) {
			res += 10 - data.cartValue;
		}
		if (data.deliveryDistance > 1000) {
			res += Math.ceil((data.deliveryDistance - 1000) / 500); // add 1 euro for each 500 meters
		}
		if (data.amountOfItems > 4) res += (data.amountOfItems - 4) * 0.5;
		if (data.amountOfItems > 12) res += 1.2;
		console.log(data);
		// console.log(new Date(data.time) > new Date());
		const day = new Date(data.time).getDay(); // Friday is 5
		const time = new Date(data.time).getHours(); // 3 - 7pm (15:00 - 19:00)
		if (day === 5 && time >= 15 && time < 19) res = 1.2 * res;

		res = res > 15 ? 15 : res;
		// console.log(time);

		setDeliveryFee(res);
	};

	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	const currentTime = now.toISOString().slice(0, 16);

	return (
		<div className="app">
			<div className="fee-calculator">
				<form onSubmit={handleSubmit(calcualteFee)} noValidate>
					<fieldset>
						<legend>Delivery Fee Calculator</legend>
						<div className="input-fields">
							<div className="input-field cart-value-container">
								<label htmlFor="cart-value" className="form-label">
									Cart value
								</label>
								<input
									{...register("cartValue", {
										valueAsNumber: true,
										value: 20.00,
									})}
									id="cart-value"
									type="number"
									data-test-id="cartValue"
									step="0.01"
									min="0"
									className={`${errors.cartValue ? "error-input" : ""}`}
									// value={getValues("cartValue") || ""}
									// value={getValues("cartValue")}

									//  									onChange={(e) => {
									// 	let newValue = Number(e.target.value);
									// 	console.log("newValue", newValue);
									// 	newValue = Number(newValue.toFixed(2));
									// 	console.log("newValue", newValue);
									// 	// // Use setValue to update the form state
									// 	setValue("cartValue", newValue);
									// 	console.log(e.target.value);
									// }}
								/>
								{/* <Controller
									name={"cartValue"}
									defaultValue={0.0}
									control={control}
									render={({ field: { value, onChange } }) => (
										<input
											id="cart-value"
											type="number"
											data-test-id="cartValue"
											step="0.01"
											value={value}
											onChange={(event) => {

												let value = String(event.target.value);
												console.log("Value before", value);
												console.log("get", getValues("cartValue"));
												if (!value.includes(".")) {
													// value = String(Number(value) / 100);
													value += ".00";
												}
												// value += getValues("cartValue");
												console.log(value);
												let willSet = Number(value).toFixed(2);
												console.log("willSet", willSet);
												// return onChange(Number(willSet));
												return onChange(willSet);
												// return onChange(Number(event.target.value).toFixed(2))
											}}
											//  											className={props.className}
											// onBlur={field.onBlur}
											// ref={field.ref}
											// name={field.name} 
										/>
									)}
								/> */}
								{errors.cartValue && (
									<div className="error-message">
										{errors.cartValue.message}
									</div>
								)}
							</div>
							<div className="input-field delivery-distance-container">
								<label htmlFor="delivery-distance" className="form-label">
									Delivery distance
								</label>
								<input
									{...register("deliveryDistance", {
										valueAsNumber: true,
										value: 2235,
									})}
									id="delivery-distance"
									type="number"
									data-test-id="deliveryDistance"
									min="0"
									step="1"
									className={`${errors.deliveryDistance ? "error-input" : ""}`}
								/>
								{errors.deliveryDistance && (
									<div className="error-message">
										{errors.deliveryDistance.message}
									</div>
								)}
							</div>
							<div className="input-field amount-of-items-container">
								<label htmlFor="amount-of-items" className="form-label">
									Amount of items
								</label>
								<input
									{...register("amountOfItems", {
										valueAsNumber: true,
										value: 4,
									})}
									id="amount-of-items"
									type="number"
									data-test-id="amountOfItems"
									min="1"
									className={`${errors.amountOfItems ? "error-input" : ""}`}
								/>
								{errors.amountOfItems && (
									<div className="error-message">
										{errors.amountOfItems.message}
									</div>
								)}
							</div>
							<div className="input-field time-container">
								<label htmlFor="time" className="form-label">
									Time
								</label>
								<input
									{...register("time", {
										valueAsDate: true,
										value: currentTime as unknown as Date })}
									id="time"
									type="datetime-local"
									data-test-id="time"
									min={currentTime}
									className={`${errors.time ? "error-input" : ""}`}
								/>
								{errors.time && (
									<div className="error-message">{errors.time.message}</div>
								)}
							</div>
							<div className="submit-field">
								<button type="submit">Calculate delivery price</button>
							</div>
							<div>
								Delivery price:{" "}
								<span data-test-id="fee">{deliveryFee.toFixed(2)}</span>€
							</div>
						</div>
					</fieldset>
				</form>
			</div>
		</div>
	);
}

export default App;
