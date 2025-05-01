import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native"
import { Feather } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"

const DeleteConfirmModal = ({ visible, onClose, onDelete, categoryName }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.confirmModalContent}>
          <View style={styles.confirmModalIcon}>
            <Feather name="alert-triangle" size={40} color={COLORS.danger} />
          </View>

          <Text style={styles.confirmModalTitle}>Delete Category?</Text>

          <Text style={styles.confirmModalText}>
            Are you sure you want to delete "{categoryName}"? This will affect all associated transactions.
          </Text>

          <View style={styles.confirmModalButtons}>
            <TouchableOpacity style={styles.confirmCancelButton} onPress={onClose}>
              <Text style={styles.confirmCancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmDeleteButton} onPress={onDelete}>
              <Text style={styles.confirmDeleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  confirmModalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    width: "85%",
    alignItems: "center",
  },
  confirmModalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(245, 54, 92, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  confirmModalText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmModalButtons: {
    flexDirection: "row",
    width: "100%",
  },
  confirmCancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: COLORS.inputBg,
  },
  confirmCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: COLORS.danger,
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})

export default DeleteConfirmModal
