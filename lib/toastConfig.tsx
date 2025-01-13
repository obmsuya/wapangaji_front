import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const toastConfig = {
  error: ({ text1, text2 }: CustomToastProps) => (
    <View
      style={[
        styles.container,
        styles.error
      ]}
    >
      {text1 && (
        <Text style={styles.errorText}>
          {text1}
        </Text>
      )}
      {text2 && <Text style={{ color: '#D92D20', fontSize: 12 }}>{text2}</Text>}
    </View>
  ),
  success: ({ text1, text2 }: CustomToastProps) => (
    <View
      style={[
        styles.container,
        styles.success
      ]}
    >
      {text1 && (
        <Text style={styles.successText}>
          {text1}
        </Text>
      )}
      {text2 && <Text style={{ color: '#208B3F', fontSize: 12 }}>{text2}</Text>}
    </View>
  )
};

export default toastConfig;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "auto",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 2
  },
  error: {
    borderColor: "#D92D20",
    backgroundColor: "#FEF3F2",
  },
  errorText: {
    color: "#D92D20",
    fontSize: 16,
    fontWeight: "500"
  },
  success: {
    borderColor: "#208B3F",
    backgroundColor: "#ECFDF3"
  },
  successText: {
    color: "#208B3F",
    fontSize: 16,
    fontWeight: "500"
  },
})