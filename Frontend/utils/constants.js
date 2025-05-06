export const CHART_COLORS = {
  Food: '#FF6B6B',
  Transport: '#4ECDC4',
  Shopping: '#FFD166',
  Entertainment: '#6A0572',
  Bills: '#1A535C',
  Housing: '#2D93AD',
  Healthcare: '#FF9F1C',
  Education: '#2EC4B6',
  Travel: '#E71D36',
  Dining: '#FF6B6B',
  Utilities: '#1A535C',
  Insurance: '#2D93AD',
  Personal: '#FF9F1C',
  Gifts: '#2EC4B6',
  Other: '#95A5A6',
};

export const INSIGHT_THRESHOLD = 10; // Percentage difference threshold for generating insights

export const CHART_CONFIG = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Housing',
  'Healthcare',
  'Education',
  'Travel',
  'Dining',
  'Utilities',
  'Insurance',
  'Personal',
  'Gifts',
  'Other'
]; 