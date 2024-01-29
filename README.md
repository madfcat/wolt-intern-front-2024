# Delivery Fee Calculator - Wolt Internship 2024

My approach for [Wolt Summer 2024 Engineering Internships](https://github.com/woltapp/engineering-internship-2024). Built using React Hook Form, zod, CSS modules, Vite.

I tried to replicate the design that was provided in the assignment.

I decided to not replicate the date picker icon because, it seems not to be possible [to hide the date picker icon](https://stackoverflow.com/a/57893173/11067821) from FireFox. There is no icon in Safari and it is possible to hide it in Chrome though.

![Design from Wolt Frontend Internship 2024 assignment](https://raw.githubusercontent.com/woltapp/engineering-internship-2024/main/example-ui.png "Design from Wolt Frontend Internship 2024 assignment")

👉 [Live website](https://wolt-intern-front-2024.netlify.app/)

## Installation

1. Install all packages
```npm install```
2. Build
```npm run build```
3. Preview
```npm run preview```

Then access the app from http://localhost:4173/

## Features

- Calculates the fee delivery based on these default requirements
	- If the cart value is less than 10€, a small order surcharge is added to the delivery price. The surcharge is the difference between the cart value and 10€. For example if the cart value is 8.90€, the surcharge will be 1.10€.
	- A delivery fee for the first 1000 meters (=1km) is 2€. If the delivery distance is longer than that, 1€ is added for every additional 500 meters that the courier needs to travel before reaching the destination. Even if the distance would be shorter than 500 meters, the minimum fee is always 1€.
	- If the number of items is five or more, an additional 50 cent surcharge is added for each item above and including the fifth item. An extra "bulk" fee applies for more than 12 items of 1,20€
	- The delivery fee can never be more than 15€, including possible surcharges.
	- The delivery is free (0€) when the cart value is equal or more than 200€.
	- During the Friday rush, 3 - 7 PM, the delivery fee (the total fee including possible surcharges) will be multiplied by 1.2x. However, the fee still cannot be more than the max (15€).
	- In frontend solutions, use the timezone of the browser (so Friday rush is 3 - 7 PM in the timezone of the browser).
- React Hook Form
- Validation with zod
	- Amount can not be less than 1
	- Time can not be set to the time earlier than the moment of schema initialization
- Native input fields
- Default values set to the values provided in the example field of the assignment
- CSS modules
- Fluid layout (inspired by [Timothy Ricks' Wizardry](https://www.youtube.com/watch?v=bPWwIbdZWu4))
- Wolt favicon (in black)
- Built using Vite
