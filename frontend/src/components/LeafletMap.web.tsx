import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  html: string;
  onMarkerPress: (id: string) => void;
};

export default function LeafletMap({ html, onMarkerPress }: Props) {
  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (typeof e.data !== "string") return;
      try {
        const obj = JSON.parse(e.data);
        if (obj?.type === "marker" && typeof obj.id === "string") {
          onMarkerPress(obj.id);
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [onMarkerPress]);

  return (
    <View style={styles.container}>
      {React.createElement("iframe", {
        srcDoc: html,
        style: {
          border: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "#F9FAFB",
        },
        sandbox: "allow-scripts allow-same-origin",
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", overflow: "hidden" },
});
