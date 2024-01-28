import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.css";

/**
 * Cart value is limited to minimum 0.
 * Delivary distance is limited to 0.
 * Amount of items can not be lower than 1. We can not delivery nothing.
 * Time validation does not allow to set time in the past.
 */
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

type Props = {
	cartValueDefault?: number;
	deliveryDistanceDefault?: number;
	amountOfItemsDefault?: number;
	timeDefault?: string;
};

const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
const currentTime = now.toISOString().slice(0, 16);

function FeeCalculator({
	cartValueDefault = 0.0,
	deliveryDistanceDefault = 0,
	amountOfItemsDefault = 1,
	timeDefault = currentTime,
}: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({ resolver: zodResolver(schema) });

	const [deliveryFee, setDeliveryFee] = useState(0);

	const calcualteFee = (data: FormData) => {
		let res = 2; // Base fee

		// Small order surcharge based on the cart value
		if (data.cartValue < 10) {
			res += 10 - data.cartValue;
		}
		// Additional distance fee (Charge each 500m after 1000m)
		if (data.deliveryDistance > 1000) {
			res += Math.ceil((data.deliveryDistance - 1000) / 500); // add 1 euro for each 500 meters
		}

		// Additional item fee (for each item after 4 items)
		if (data.amountOfItems > 4) res += (data.amountOfItems - 4) * 0.5;
		if (data.amountOfItems > 12) res += 1.2;

		// Rush fee (Friday 15:00 - 19:00
		const day = new Date(data.time).getDay(); // Friday is 5
		const time = new Date(data.time).getHours(); // 3 - 7pm (15:00 - 19:00)
		if (day === 5 && time >= 15 && time < 19) res = 1.2 * res;

		// Limit delivery price to 15
		res = res > 15 ? 15 : res;

		// Free delivery for orders from 200 euro
		res = data.cartValue >= 200 ? 0 : res;

		setDeliveryFee(res);
	};

	return (
		<div className={styles["fee-calculator"]}>
			<form onSubmit={handleSubmit(calcualteFee)} noValidate>
				<fieldset>
					<legend>Delivery Fee Calculator</legend>
					<div className={styles["input-fields"]}>
						<div className={`${styles["input-field"]} ${styles["cart-value-field"]}`}>
							<label htmlFor="cart-value" className={styles["form-label"]}>
								Cart value
							</label>
							<input
								{...register("cartValue", {
									valueAsNumber: true,
									value: cartValueDefault,
								})}
								id="cart-value"
								type="number"
								data-test-id="cartValue"
								step="0.01"
								min="0"
								className={errors.cartValue ? "error-input" : ""}
							/>
							{errors.cartValue && (
								<div className={styles["error-message"]}>{errors.cartValue.message}</div>
							)}
						</div>
						<div className={`${styles["input-field"]} ${styles["delivery-distance-field"]}`}>
							<label htmlFor="delivery-distance" className={styles["form-label"]}>
								Delivery distance
							</label>
							<input
								{...register("deliveryDistance", {
									valueAsNumber: true,
									value: deliveryDistanceDefault,
								})}
								id="delivery-distance"
								type="number"
								data-test-id="deliveryDistance"
								min="0"
								step="1"
								className={errors.deliveryDistance ? styles["error-input"] : ""}
							/>
							{errors.deliveryDistance && (
								<div className={styles["error-message"]}>
									{errors.deliveryDistance.message}
								</div>
							)}
						</div>
						<div className={`${styles["input-field"]}`}>
							<label htmlFor="amount-of-items" className={styles["form-label"]}>
								Amount of items
							</label>
							<input
								{...register("amountOfItems", {
									valueAsNumber: true,
									value: amountOfItemsDefault,
								})}
								id="amount-of-items"
								type="number"
								data-test-id="amountOfItems"
								min="1"
								className={errors.amountOfItems ? styles["error-input"] : ""}
							/>
							{errors.amountOfItems && (
								<div className={styles["error-message"]}>
									{errors.amountOfItems.message}
								</div>
							)}
						</div>
						<div className={`${styles["input-field"]} ${styles["time-field"]}`}>
							<label htmlFor="time" className={styles["form-label"]}>
								Time
							</label>
							<input
								{...register("time", {
									valueAsDate: true,
									value: timeDefault as unknown as Date,
								})}
								id="time"
								type="datetime-local"
								data-test-id="time"
								min={currentTime}
								className={errors.time ? styles["error-input"] : ""}
							/>
							{errors.time && (
								<div className={styles["error-message"]}>{errors.time.message}</div>
							)}
						</div>
						<div className={styles["submit-field"]}>
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
	);
}

export default FeeCalculator;
