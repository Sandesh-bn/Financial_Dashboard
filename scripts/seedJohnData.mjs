import fs from "node:fs";
import mongoose from "../../Backend/node_modules/mongoose/index.js";
import User from "../../Backend/models/userModel.js";
import Income from "../../Backend/models/incomeModel.js";
import Expense from "../../Backend/models/expenseModel.js";

const envText = fs.readFileSync(new URL("../../Backend/.env", import.meta.url), "utf8");
const connectionString = envText
  .split(/\r?\n/)
  .find((line) => line.startsWith("CONNECTION_STRING="))
  ?.replace("CONNECTION_STRING=", "")
  .replace(/^['"]|['"]$/g, "");

if (!connectionString) {
  throw new Error("Missing CONNECTION_STRING in Backend/.env");
}

const incomeCategories = {
  Salary: ["Monthly salary", "Payroll deposit", "Base pay"],
  Freelance: ["Website project", "Consulting invoice", "Design contract"],
  Bonus: ["Quarterly bonus", "Performance bonus", "Referral bonus"],
  Investment: ["Dividend payout", "Stock sale", "Interest income"],
  Gift: ["Family gift", "Birthday gift", "Cash gift"],
  Refund: ["Tax refund", "Purchase refund", "Reimbursement"]
};

const expenseCategories = {
  Housing: ["Rent payment", "Home maintenance", "Renters insurance"],
  Food: ["Groceries", "Restaurant meal", "Coffee run", "Meal delivery"],
  Transport: ["Fuel", "Rideshare", "Transit pass", "Car maintenance"],
  Utilities: ["Electric bill", "Water bill", "Internet bill", "Phone bill"],
  Health: ["Pharmacy", "Doctor visit", "Gym membership"],
  Shopping: ["Clothing", "Home goods", "Electronics accessory"],
  Entertainment: ["Streaming service", "Movie night", "Concert ticket"],
  Travel: ["Hotel stay", "Flight booking", "Weekend trip"],
  Education: ["Online course", "Book purchase", "Workshop fee"],
  Insurance: ["Auto insurance", "Health insurance", "Life insurance"]
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(items) {
  return items[randomInt(0, items.length - 1)];
}

function randomDateBetween(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function addMonths(date, count) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + count);
  return next;
}

function money(min, max) {
  return randomInt(min * 100, max * 100) / 100;
}

function makeIncome(userId, date, category, amount, description) {
  return {
    userId,
    description,
    amount,
    category,
    date,
    type: "income"
  };
}

function makeExpense(userId, date, category, amount, description) {
  return {
    userId,
    description,
    amount,
    category,
    date,
    type: "expense"
  };
}

function generateSeedData(userId) {
  const now = new Date();
  const start = new Date(now);
  start.setFullYear(now.getFullYear() - 3);

  const incomes = [];
  const expenses = [];

  for (let i = 0; i < 36; i += 1) {
    const month = addMonths(start, i);
    const salaryDate = new Date(month.getFullYear(), month.getMonth(), randomInt(1, 5));
    incomes.push(makeIncome(userId, salaryDate, "Salary", money(4300, 6200), pick(incomeCategories.Salary)));

    if (Math.random() > 0.45) {
      incomes.push(
        makeIncome(
          userId,
          new Date(month.getFullYear(), month.getMonth(), randomInt(10, 25)),
          "Freelance",
          money(250, 2400),
          pick(incomeCategories.Freelance)
        )
      );
    }

    if (i % 3 === 0) {
      incomes.push(
        makeIncome(
          userId,
          new Date(month.getFullYear(), month.getMonth(), randomInt(15, 28)),
          "Bonus",
          money(500, 3500),
          pick(incomeCategories.Bonus)
        )
      );
    }

    if (Math.random() > 0.6) {
      const category = pick(["Investment", "Gift", "Refund"]);
      incomes.push(
        makeIncome(
          userId,
          randomDateBetween(new Date(month.getFullYear(), month.getMonth(), 1), new Date(month.getFullYear(), month.getMonth() + 1, 0)),
          category,
          money(50, 900),
          pick(incomeCategories[category])
        )
      );
    }
  }

  for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
    const day = new Date(d);

    if (Math.random() > 0.18) {
      expenses.push(makeExpense(userId, day, "Food", money(8, 145), pick(expenseCategories.Food)));
    }

    if (day.getDate() === 1) {
      expenses.push(makeExpense(userId, day, "Housing", money(1450, 2450), pick(expenseCategories.Housing)));
    }

    if ([3, 10, 17, 24].includes(day.getDate()) && Math.random() > 0.25) {
      const category = pick(["Transport", "Shopping", "Entertainment", "Health"]);
      expenses.push(makeExpense(userId, day, category, money(15, 420), pick(expenseCategories[category])));
    }

    if ([5, 12, 20, 27].includes(day.getDate()) && Math.random() > 0.45) {
      const category = pick(["Utilities", "Insurance", "Education", "Travel"]);
      expenses.push(makeExpense(userId, day, category, money(25, 850), pick(expenseCategories[category])));
    }
  }

  return { incomes, expenses };
}

await mongoose.connect(connectionString);

const john = await User.findOne({ name: /^john$/i });

if (!john) {
  await mongoose.disconnect();
  throw new Error('Could not find a user named "John"');
}

const { incomes, expenses } = generateSeedData(john._id);
await Income.insertMany(incomes);
await Expense.insertMany(expenses);

const [incomeCount, expenseCount] = await Promise.all([
  Income.countDocuments({ userId: john._id }),
  Expense.countDocuments({ userId: john._id })
]);

console.log(`Seeded ${incomes.length} income records and ${expenses.length} expense records for ${john.name}.`);
console.log(`John now has ${incomeCount} income records and ${expenseCount} expense records total.`);

await mongoose.disconnect();
