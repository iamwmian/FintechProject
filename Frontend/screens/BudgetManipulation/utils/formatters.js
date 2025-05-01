// Format date for display
export const formatDate = (date) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  
  // Format currency
  export const formatCurrency = (amount, currency = "USD") => {
    return `${currency} ${amount.toFixed(2)}`
  }
  
  // Calculate spending percentage
  export const calculatePercentage = (spent, budget) => {
    return (spent / budget) * 100
  }
  