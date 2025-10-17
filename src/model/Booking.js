import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    showtimeId: {
      type: String,
      required: true
    },
    movieTitle: {
      type: String,
      required: true
    },
    moviePoster: {
      type: String,
      default: "/images/default-poster.jpg"
    },
    cinemaInfo: {
      systemName: { type: String, required: true },
      clusterName: { type: String, required: true },
      hallName: { type: String, required: true }
    },
    showtimeInfo: {
      date: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    },
    seats: [{
      seatNumber: { type: String, required: true },
      type: { type: String, enum: ['regular', 'vip'], required: true },
      price: { type: Number, required: true }
    }],
    combos: [{
      comboId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }],
    total: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['momo', 'vnpay', 'visa', 'cod'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending'
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'expired'],
      default: 'confirmed'
    },
    qrCode: {
      type: String // QR code data URL
    },
    bookingCode: {
      type: String,
      unique: true,
      required: true
    }
  },
  { timestamps: true }
);

// Indexes
BookingSchema.index({ userId: 1 });
BookingSchema.index({ showtimeId: 1 });
BookingSchema.index({ bookingCode: 1 });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;