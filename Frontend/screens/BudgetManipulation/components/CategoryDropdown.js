"use client";

import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/constants";
import { BASE_URL } from "@env"
const userId = 1
// Enhanced dropdown component that fetches categories from an API using axios
const CategoryDropdown = ({
  selectedValue,
  onSelect,
  placeholder = "Select Category",
  containerStyle = {},
  labelStyle = {},
  buttonStyle = {},
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on component mount using axios
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("CategoryDropdown: Fetching categories...");
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`${BASE_URL}/api/categories/user/${userId}`);

        console.log("CategoryDropdown: API response received with", response.data.length, "categories");

        setCategories(response.data); 
      } catch (error) {
        console.error("CategoryDropdown: Error fetching categories:", error);
        setError("Failed to load categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);


  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.id.toString().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (category) => {
    console.log("CategoryDropdown: Selected", category.title);
    onSelect(category.title); // Pass the title or any relevant information
    setModalVisible(false);
    setSearchQuery("");
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={() => {
          console.log("CategoryDropdown: Opening modal");
          setSearchQuery("");
          setModalVisible(true);
        }}
      >
        <Text style={[styles.buttonText, labelStyle]}>
          {selectedValue || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {/* Standalone Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log("CategoryDropdown: Closing modal");
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("CategoryDropdown: Closing modal via X button");
                  setModalVisible(false);
                }}
              >
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search categories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textSecondary}
            />

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading categories...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <FlatList
                data={filteredCategories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.listItem, selectedValue === item.title && styles.selectedItem]}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.listItemContent}>
                      <Text style={[styles.listItemText, { color: item.color, fontWeight:800 }]}>
                        {item.title} ({item.currency})
                      </Text>
                      <Text style={[styles.currencyText, { color: item.color }]}>
                        Monthly Budget: ${item.monthly_budget}
                      </Text>
                    </View>
                    {selectedValue === item.title && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                )}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={10}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: COLORS.inputBg,
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.inputBg,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listItemContent: {
    flex: 1,
  },
  selectedItem: {
    backgroundColor: COLORS.inputBg,
  },
  listItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  currencyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: "center",
  },
});

export default CategoryDropdown;
