"use strict";
//D:\D-Luxury-Car-Showroom\Backend\src\modules\cars\car.seed.ts
// import { Car } from "./models/car.model.js";
Object.defineProperty(exports, "__esModule", { value: true });
// const cars = [
//   {
//     name: "BMW M4 Competition",
//     slug: "bmw-m4-competition",
//     brand: "BMW",
//     category: "Coupe",
//     basePrice: 15500000,
//     description:
//       "High-performance luxury coupe engineered for exceptional driving dynamics.",
//     colors: [
//       {
//         name: "Frozen Black",
//         hex: "#090909",
//         price: 0,
//       },
//       {
//         name: "Alpine White",
//         hex: "#f5f5f5",
//         price: 75000,
//       },
//       {
//         name: "Portimao Blue",
//         hex: "#123d72",
//         price: 110000,
//       },
//       {
//         name: "Toronto Red",
//         hex: "#8c1015",
//         price: 125000,
//       },
//     ],
//     wheels: [
//       {
//         name: "M Double-Spoke",
//         price: 0,
//       },
//       {
//         name: "M Performance",
//         price: 175000,
//       },
//       {
//         name: "Carbon Edition",
//         price: 350000,
//       },
//     ],
//     interiors: [
//       {
//         name: "Black Leather",
//         color: "#111111",
//         price: 0,
//       },
//       {
//         name: "Red Merino",
//         color: "#681b20",
//         price: 185000,
//       },
//       {
//         name: "Tartufo",
//         color: "#654c39",
//         price: 210000,
//       },
//     ],
//     featured: true,
//     isActive: true,
//   },
//   {
//     name: "BMW X5 M",
//     slug: "bmw-x5-m",
//     brand: "BMW",
//     category: "SUV",
//     basePrice: 17500000,
//     description:
//       "Luxury performance SUV combining commanding presence with motorsport-inspired performance.",
//     colors: [
//       {
//         name: "Black Sapphire",
//         hex: "#080808",
//         price: 0,
//       },
//       {
//         name: "Mineral White",
//         hex: "#eeeeee",
//         price: 80000,
//       },
//       {
//         name: "Marina Bay Blue",
//         hex: "#0c3b65",
//         price: 125000,
//       },
//     ],
//     wheels: [
//       {
//         name: "M Sport",
//         price: 0,
//       },
//       {
//         name: "M Performance",
//         price: 190000,
//       },
//     ],
//     interiors: [
//       {
//         name: "Black",
//         color: "#111111",
//         price: 0,
//       },
//       {
//         name: "Coffee",
//         color: "#4b3425",
//         price: 170000,
//       },
//     ],
//     featured: true,
//     isActive: true,
//   },
//   {
//     name: "BMW i7",
//     slug: "bmw-i7",
//     brand: "BMW",
//     category: "Electric",
//     basePrice: 21000000,
//     description:
//       "A fully electric luxury sedan delivering silent performance and next-generation technology.",
//     colors: [
//       {
//         name: "Black Sapphire",
//         hex: "#080808",
//         price: 0,
//       },
//       {
//         name: "Mineral White",
//         hex: "#f2f2f2",
//         price: 90000,
//       },
//       {
//         name: "Oxide Grey",
//         hex: "#55585b",
//         price: 100000,
//       },
//     ],
//     wheels: [
//       {
//         name: "Aero",
//         price: 0,
//       },
//       {
//         name: "Luxury Multi-Spoke",
//         price: 220000,
//       },
//     ],
//     interiors: [
//       {
//         name: "Black",
//         color: "#111111",
//         price: 0,
//       },
//       {
//         name: "Mocha",
//         color: "#60483b",
//         price: 200000,
//       },
//     ],
//     featured: true,
//     isActive: true,
//   },
// ];
// export async function seedCars() {
//   for (const car of cars) {
//     await Car.findOneAndUpdate(
//       {
//         slug: car.slug,
//       },
//       car,
//       {
//         upsert: true,
//         returnDocument: "after",
//       }
//     );
//   }
//   console.log("Car seed completed.");
// }
