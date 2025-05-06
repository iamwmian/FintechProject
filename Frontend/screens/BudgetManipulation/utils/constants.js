// Color palette
export const COLORS = {
  primary: "#0A2463",
  primaryLight: "#1E3A8A",
  secondary: "#3E92CC",
  accent: "#FF6B6B",
  success: "#2DCE89",
  warning: "#FB8C00",
  danger: "#F5365C",
  background: "#F7F9FC",
  card: "#FFFFFF",
  text: "#1A1F36",
  textSecondary: "#8898AA",
  border: "#E9ECEF",
  inputBg: "#F4F5F7",
}

// Initial mock data
export const initialCategories = [
  { id: "1", name: "Food", color: "#FF6B6B", monthlyBudget: 500 },
  { id: "2", name: "Transport", color: "#4ECDC4", monthlyBudget: 300 },
  { id: "3", name: "Shopping", color: "#FFD166", monthlyBudget: 400 },
  { id: "4", name: "Entertainment", color: "#6A0572", monthlyBudget: 200 },
  { id: "5", name: "Bills", color: "#1A535C", monthlyBudget: 800 },
]

// Add location to transactions
export const initialTransactions = [
  // United States
  { id: "1", title: "Grocery Shopping", cost: 85.5, currency: "USD", category: "Food", date: new Date(2025, 3, 8), country: "United States" },
  { id: "2", title: "Uber Ride", cost: 24.75, currency: "USD", category: "Transport", date: new Date(2025, 3, 7), country: "United States" },
  { id: "7", title: "Coffee", cost: 5.0, currency: "USD", category: "Food", date: new Date(2025, 3, 6), country: "United States" },
  { id: "8", title: "Gym Membership", cost: 50.0, currency: "USD", category: "Bills", date: new Date(2025, 3, 4), country: "United States" },
  { id: "9", title: "Concert Tickets", cost: 120.0, currency: "USD", category: "Entertainment", date: new Date(2025, 3, 3), country: "United States" },
  { id: "10", title: "Gas", cost: 40.0, currency: "USD", category: "Transport", date: new Date(2025, 3, 2), country: "United States" },

  // Mexico
  { id: "3", title: "Movie Tickets", cost: 32.0, currency: "USD", category: "Entertainment", date: new Date(2025, 3, 5), country: "Mexico" },
  { id: "11", title: "Tacos", cost: 150, currency: "MXN", category: "Food", date: new Date(2025, 3, 4), country: "Mexico" },
  { id: "12", title: "Bus Fare", cost: 20, currency: "MXN", category: "Transport", date: new Date(2025, 3, 3), country: "Mexico" },
  { id: "13", title: "Souvenirs", cost: 500, currency: "MXN", category: "Shopping", date: new Date(2025, 3, 2), country: "Mexico" },
  { id: "14", title: "Hotel Stay", cost: 2000, currency: "MXN", category: "Bills", date: new Date(2025, 3, 1), country: "Mexico" },

  // India
  { id: "4", title: "Internet Bill", cost: 65.99, currency: "USD", category: "Bills", date: new Date(2025, 3, 1), country: "India" },
  { id: "5", title: "Street Food", cost: 1200, currency: "INR", category: "Food", date: new Date(2025, 2, 25), country: "India" },
  { id: "15", title: "Train Ticket", cost: 500, currency: "INR", category: "Transport", date: new Date(2025, 2, 24), country: "India" },
  { id: "16", title: "Clothing", cost: 3000, currency: "INR", category: "Shopping", date: new Date(2025, 2, 23), country: "India" },
  { id: "17", title: "Temple Donation", cost: 200, currency: "INR", category: "Bills", date: new Date(2025, 2, 22), country: "India" },
  { id: "18", title: "Cinema", cost: 400, currency: "INR", category: "Entertainment", date: new Date(2025, 2, 21), country: "India" },
];