import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const colors = {
  primary: '#6B2FB3',
  primaryLight: '#F6F2F9',
  secondary: '#F8F4FB',
  text: '#1A1A1A',
  textSecondary: '#666666',
  white: '#FFFFFF',
};

interface SpontaneousReplyProps {
  eventId: string;
  onReply: (eventId: string, message: string) => void;
}

export default function SpontaneousReply({ eventId, onReply }: SpontaneousReplyProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendReply = () => {
    if (message.trim()) {
      onReply(eventId, message);
      setMessage('');
      setModalVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.replyButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="reply" size={20} color={colors.primary} />
        <Text style={styles.replyButtonText}>Reply</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reply to Plan</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.messageInput}
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                !message.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSendReply}
              disabled={!message.trim()}
            >
              <Text style={styles.sendButtonText}>Send Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
  },
  replyButtonText: {
    marginLeft: 4,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  messageInput: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: colors.text,
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
