import { Modal, View, Text, TouchableOpacity } from 'react-native';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  destructive,
  busy,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        className="flex-1 justify-center items-center px-8"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.72)' }}
      >
        <View className="bg-bgCard rounded-[20px] w-full max-w-[340px] px-5 py-6 border border-stroke">
          <Text className="font-inter font-bold text-lg text-text text-center">
            {title}
          </Text>
          <Text className="font-inter font-normal text-[13px] leading-[18px] text-textMuted text-center mt-2">
            {message}
          </Text>
          <View className="flex-row gap-3 mt-6">
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.8}
              className="flex-1 rounded-2xl justify-center items-center py-[14px] bg-bgCard2 border border-stroke"
            >
              <Text className="font-inter font-bold text-[13px] text-text">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              activeOpacity={0.8}
              className={`flex-1 rounded-2xl justify-center items-center py-[14px] ${destructive ? 'bg-liveRed' : 'bg-accent'}`}
            >
              <Text className="font-inter font-bold text-[13px] text-bg">
                {busy ? 'Working…' : confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
