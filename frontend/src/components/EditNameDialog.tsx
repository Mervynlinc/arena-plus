import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';

interface EditNameDialogProps {
  visible: boolean;
  value: string;
  saving: boolean;
  error: string | null;
  onChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditNameDialog({
  visible,
  value,
  saving,
  error,
  onChange,
  onSave,
  onCancel,
}: EditNameDialogProps) {
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
            Change Name
          </Text>
          <Text className="font-inter font-normal text-[13px] leading-[18px] text-textMuted text-center mt-2">
            Enter a new name for your account.
          </Text>
          <View className="bg-bgCard2 border border-stroke rounded-2xl px-4 mt-5">
            <TextInput
              className="font-inter text-base text-text py-[14px]"
              placeholder="Name"
              placeholderTextColor="#5C5C63"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              autoComplete="username"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={onSave}
              editable={!saving}
            />
          </View>
          {error ? (
            <Text className="font-inter font-normal text-[13px] leading-[18px] text-liveRed mt-3">
              {error}
            </Text>
          ) : null}
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
              onPress={onSave}
              activeOpacity={0.8}
              className="flex-1 rounded-2xl justify-center items-center py-[14px] bg-accent"
            >
              <Text className="font-inter font-bold text-[13px] text-bg">
                {saving ? 'Saving…' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
