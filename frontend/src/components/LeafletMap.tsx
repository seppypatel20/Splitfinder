import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

type Props = {
  html: string;
  onMarkerPress: (id: string) => void;
};

export default function LeafletMap({ html, onMarkerPress }: Props) {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        onMessage={(e: WebViewMessageEvent) => {
          try {
            const obj = JSON.parse(e.nativeEvent.data);
            if (obj?.type === "marker" && typeof obj.id === "string") {
              onMarkerPress(obj.id);
            }
          } catch {
            /* ignore */
          }
        }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        androidLayerType="hardware"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  webview: { flex: 1, backgroundColor: "#F9FAFB" },
});
