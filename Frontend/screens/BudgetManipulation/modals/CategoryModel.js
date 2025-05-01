import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StyleSheet,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Pressable,
  } from "react-native"
  import { Feather } from "@expo/vector-icons"
  import { COLORS } from "../utils/constants"
  
  const CategoryModal = ({ visible, onClose, onSave, category, setCategory, isEditing }) => {
    return (
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <Pressable style={styles.modalBackdrop} onPress={onClose} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? "Edit Category" : "Add Category"}</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
                <Feather name="x" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
  
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Food, Transport, etc."
                  placeholderTextColor={COLORS.textSecondary}
                  value={category.name}
                  onChangeText={(text) => setCategory({ ...category, name: text })}
                />
              </View>
  
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Monthly Budget</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="numeric"
                  value={category.monthlyBudget}
                  onChangeText={(text) => setCategory({ ...category, monthlyBudget: text })}
                />
              </View>
  
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Color</Text>
                <View style={styles.colorOptions}>
                  {[
                    "#FF6B6B",
                    "#4ECDC4",
                    "#FFD166",
                    "#6A0572",
                    "#1A535C",
                    "#3366FF",
                    "#F26419",
                    "#2DCE89",
                    "#FB8C00",
                    "#F5365C",
                  ].map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        category.color === color && styles.selectedColorOption,
                      ]}
                      onPress={() => setCategory({ ...category, color })}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
  
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText}>{isEditing ? "Update Category" : "Add Category"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }
  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalBackdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    modalContent: {
      backgroundColor: COLORS.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: "90%",
    },
    modalHandle: {
      width: 40,
      height: 5,
      borderRadius: 3,
      backgroundColor: COLORS.border,
      alignSelf: "center",
      marginTop: 10,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: COLORS.text,
    },
    modalCloseButton: {
      padding: 4,
    },
    modalBody: {
      padding: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 15,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: COLORS.inputBg,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: COLORS.text,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    colorOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 10,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 14,
      marginBottom: 14,
    },
    selectedColorOption: {
      borderWidth: 3,
      borderColor: COLORS.text,
    },
    modalFooter: {
      flexDirection: "row",
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 14,
      alignItems: "center",
      borderRadius: 12,
      marginRight: 10,
      backgroundColor: COLORS.inputBg,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.textSecondary,
    },
    saveButton: {
      flex: 2,
      paddingVertical: 14,
      alignItems: "center",
      borderRadius: 12,
      backgroundColor: COLORS.primary,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
  })
  
  export default CategoryModal;
  