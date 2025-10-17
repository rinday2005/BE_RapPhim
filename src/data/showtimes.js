// Showtimes and booking data for backend
export const showtimeData = [
  {
    showtimeId: "ST001",
    movieId: "M001",
    hallId: "H001",
    clusterId: "CLU001",
    startTime: "14:00",
    endTime: "17:01",
    price: 100000,
    priceBySeatType: {
      regular: 100000,
      vip: 150000,
    }, // Giá cơ bản (regular)
    priceBySeatType: {
      regular: 100000,
      vip: 150000,
    },
    date: "2024-01-15",
    availableSeats: 280,
    totalSeats: 300,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    showtimeId: "ST002",
    movieId: "M001",
    hallId: "H001",
    clusterId: "CLU001",
    startTime: "17:30",
    endTime: "20:31",
    price: 100000,
    priceBySeatType: {
      regular: 100000,
      vip: 150000,
    },
    priceBySeatType: {
      regular: 100000,
      vip: 150000,
    },
    date: "2024-01-15",
    availableSeats: 250,
    totalSeats: 300,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    showtimeId: "ST003",
    movieId: "M001",
    hallId: "H001",
    clusterId: "CLU001",
    startTime: "21:00",
    endTime: "00:01",
    price: 100000,
    priceBySeatType: {
      regular: 100000,
      vip: 150000,
    },
    priceBySeatType: {
      regular: 100000,
      vip: 150000,
    },
    date: "2024-01-15",
    availableSeats: 200,
    totalSeats: 300,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    showtimeId: "ST004",
    movieId: "M002",
    hallId: "H002",
    clusterId: "CLU001",
    startTime: "15:30",
    endTime: "17:58",
    price: 100000,
    priceBySeatType: {
      regular: 100000,
      vip: 150000,
    },
    date: "2024-01-15",
    availableSeats: 100,
    totalSeats: 120,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    showtimeId: "ST005",
    movieId: "M002",
    hallId: "H002",
    clusterId: "CLU001",
    startTime: "19:00",
    endTime: "21:28",
    price: 100000,
    priceBySeatType: {
      regular: 100000,
      vip: 150000,
    },
    date: "2024-01-15",
    availableSeats: 80,
    totalSeats: 120,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    showtimeId: "ST006",
    movieId: "M003",
    hallId: "H003",
    clusterId: "CLU001",
    startTime: "16:00",
    endTime: "18:35",
    price: 80000,
    date: "2024-01-15",
    availableSeats: 150,
    totalSeats: 200,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    showtimeId: "ST007",
    movieId: "M003",
    hallId: "H003",
    clusterId: "CLU001",
    startTime: "20:15",
    endTime: "22:50",
    price: 80000,
    date: "2024-01-15",
    availableSeats: 120,
    totalSeats: 200,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    showtimeId: "ST008",
    movieId: "M001",
    hallId: "H004",
    clusterId: "CLU002",
    startTime: "14:30",
    endTime: "17:31",
    price: 150000,
    date: "2024-01-15",
    availableSeats: 300,
    totalSeats: 350,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    showtimeId: "ST009",
    movieId: "M002",
    hallId: "H005",
    clusterId: "CLU003",
    startTime: "18:00",
    endTime: "20:28",
    price: 200000,
    date: "2024-01-15",
    availableSeats: 60,
    totalSeats: 80,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const seatData = [
  {
    seatId: "A01",
    hallId: "H001",
    row: "A",
    number: 1,
    type: "regular",
    status: "available",
    price: 100000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    seatId: "A02",
    hallId: "H001",
    row: "A",
    number: 2,
    type: "regular",
    status: "available",
    price: 100000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    seatId: "H13",
    hallId: "H001",
    row: "H",
    number: 13,
    type: "couple",
    status: "available",
    price: 50000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    seatId: "H14",
    hallId: "H001",
    row: "H",
    number: 14,
    type: "couple",
    status: "available",
    price: 50000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    seatId: "F01",
    hallId: "H001",
    row: "F",
    number: 1,
    type: "vip",
    status: "available",
    price: 150000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const bookingData = [
  {
    bookingId: "BK001",
    userId: "USER001",
    showtimeId: "ST001",
    seatIds: ["M15", "M16"],
    bookingTime: new Date("2024-01-15T10:30:00Z"),
    totalAmount: 240000,
    status: "confirmed",
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    bookingId: "BK002",
    userId: "USER002",
    showtimeId: "ST002",
    seatIds: ["A01", "A02"],
    bookingTime: new Date("2024-01-15T11:00:00Z"),
    totalAmount: 240000,
    status: "pending",
    paymentMethod: "cash",
    paymentStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Helper functions for backend
export const getShowtimesByMovie = (movieId) => {
  return showtimeData.filter((showtime) => showtime.movieId === movieId);
};

export const getShowtimesByCluster = (clusterId) => {
  return showtimeData.filter((showtime) => showtime.clusterId === clusterId);
};

export const getShowtimesByDate = (date) => {
  return showtimeData.filter((showtime) => showtime.date === date);
};

export const getShowtimeById = (showtimeId) => {
  return showtimeData.find((showtime) => showtime.showtimeId === showtimeId);
};

export const getSeatsByHall = (hallId) => {
  return seatData.filter((seat) => seat.hallId === hallId);
};

export const getAvailableSeats = (hallId) => {
  return seatData.filter(
    (seat) => seat.hallId === hallId && seat.status === "available"
  );
};

export const getBookingsByUser = (userId) => {
  return bookingData.filter((booking) => booking.userId === userId);
};

export const getBookingById = (bookingId) => {
  return bookingData.find((booking) => booking.bookingId === bookingId);
};

export const createShowtime = (showtimeData) => {
  const newShowtime = {
    showtimeId: `ST${String(showtimeData.length + 1).padStart(3, "0")}`,
    ...showtimeData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  showtimeData.push(newShowtime);
  return newShowtime;
};

export const createBooking = (bookingData) => {
  const newBooking = {
    bookingId: `BK${String(bookingData.length + 1).padStart(3, "0")}`,
    ...bookingData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  bookingData.push(newBooking);
  return newBooking;
};

export const updateBookingStatus = (bookingId, status) => {
  const booking = bookingData.find((b) => b.bookingId === bookingId);
  if (booking) {
    booking.status = status;
    booking.updatedAt = new Date();
    return booking;
  }
  return null;
};