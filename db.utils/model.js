import mongoose, { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { string } from "yup";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    is_vendor: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Usermodel = mongoose.model("User", userSchema, "Users");

const vendorSchema = new Schema({
  id: { type: String, default: uuidv4, unique: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usermodel",
    required: true,
    default: uuidv4(),
  },
  name: { type: String, required: true },
  service_type: { type: String, required: true },
  contact_info: {
    phone: { type: String },
    email: { type: String },
    address: { type: String },
  },
  rating: { type: Number, required: true },
});

const Vendormodel = mongoose.model("Vendor", vendorSchema, "Vendors");

// Event model
const eventSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usermodel",
      required: true,
      default: uuidv4(),
    },
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["ceremonies", "receptions", "other_related_functions", "marriage"],
      trim: true,
    },
    location: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    status: {
      type: String,
      enum: ["planned", "completed"],
      default: "planned",
    },
    imageUrl: { type: String, required: true },
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Eventmodel = model("Event", eventSchema, "Events");

// Expense model
const expenseSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const ExpenseModel = model("Expense", expenseSchema, "Expenses");

// Budget model
const budgetSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usermodel",
      required: true,
      // default: uuidv4(),
    },
    event_id: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    category: { type: String, required: true },
    amount_allocated: { type: Number, required: true },
    amount_spent: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Budgetmodel = model("Budget", budgetSchema, "Budgets");

const bookingSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usermodel",
      required: true,
    },
    vendor_id: {
      type: String,
      required: true,
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Event",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const BookingModel = model("Booking", bookingSchema, "Bookings");
export {
  Usermodel,
  Vendormodel,
  Eventmodel,
  Budgetmodel,
  BookingModel,
  ExpenseModel,
};
