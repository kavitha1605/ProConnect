import dotenv from "dotenv";

// Test dotenv loading
dotenv.config({ path: './.env' });

console.log("=== DOTENV TEST ===");
console.log("Current working directory:", process.cwd());
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("PORT:", process.env.PORT);
console.log("=== END TEST ===");