import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Property } from "@/src/data/properties";
import { isSaved, toggleSaved } from "@/src/utils/savedProperties";

type Props = {
  property: Property | null;
  visible: boolean;
  onClose: () => void;
  onSavedChange?: () => void;
};

const REQUIRED_PER_LOT = 10; // meters per lot
const LOTS = 2;
const REQUIRED_TOTAL = REQUIRED_PER_LOT * LOTS;

export default function PropertyDetailsModal({
  property,
  visible,
  onClose,
  onSavedChange,
}: Props) {
  const [saved, setSaved] = useState(false);
  const [frontageInput, setFrontageInput] = useState("");
  const lastIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!property) return;
    if (lastIdRef.current !== property.id) {
      lastIdRef.current = property.id;
      setFrontageInput(String(property.frontage));
    }
    isSaved(property.id).then(setSaved);
  }, [property]);

  const frontageValue = useMemo(() => {
    const n = parseFloat(frontageInput);
    return Number.isFinite(n) ? n : 0;
  }, [frontageInput]);

  const passes = frontageValue >= REQUIRED_TOTAL;

  const handleSave = async () => {
    if (!property) return;
    const next = await toggleSaved(property.id);
    setSaved(next);
    onSavedChange?.();
  };

  if (!property) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
          testID="property-modal-backdrop"
        />
        <SafeAreaView edges={["bottom"]} style={styles.sheetWrap}>
          <View style={styles.sheet} testID="property-details-sheet">
            <View style={styles.handle} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scroll}
              keyboardShouldPersistTaps="handled"
            >
              <Image
                source={{ uri: property.imageUrl }}
                style={styles.hero}
                contentFit="cover"
                transition={200}
              />

              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.suburbTag} testID="prop-suburb">
                    {property.suburb.toUpperCase()} · {property.state}
                  </Text>
                  <Text style={styles.address} testID="prop-address">
                    {property.address}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeBtn}
                  testID="close-property-modal"
                >
                  <Ionicons name="close" size={20} color="#0A0A0A" />
                </TouchableOpacity>
              </View>

              <Text style={styles.price} testID="prop-price">
                ${property.price.toLocaleString()}
              </Text>

              <View style={styles.statsRow}>
                <Stat icon="bed-outline" label="Beds" value={String(property.bedrooms)} />
                <Stat icon="water-outline" label="Baths" value={String(property.bathrooms)} />
                <Stat icon="resize-outline" label="Land" value={`${property.landSize}m²`} />
                <Stat icon="swap-horizontal-outline" label="Frontage" value={`${property.frontage}m`} />
              </View>

              <Text style={styles.description}>{property.description}</Text>

              <View style={styles.calcCard} testID="frontage-calculator">
                <View style={styles.calcHeader}>
                  <Ionicons name="construct-outline" size={16} color="#0A0A0A" />
                  <Text style={styles.calcTitle}>Frontage Calculator</Text>
                </View>
                <Text style={styles.calcHint}>
                  Enter the street frontage in metres. A two-lot split needs at least{" "}
                  {REQUIRED_PER_LOT}m per lot ({REQUIRED_TOTAL}m total).
                </Text>

                <View style={styles.inputRow}>
                  <TextInput
                    value={frontageInput}
                    onChangeText={setFrontageInput}
                    keyboardType="decimal-pad"
                    placeholder="e.g. 20"
                    placeholderTextColor="#94A3B8"
                    style={styles.input}
                    testID="frontage-input"
                  />
                  <Text style={styles.unit}>m</Text>
                </View>

                <View
                  style={[
                    styles.resultPill,
                    passes ? styles.resultPass : styles.resultFail,
                  ]}
                  testID="frontage-result"
                >
                  <Ionicons
                    name={passes ? "checkmark-circle" : "close-circle"}
                    size={18}
                    color={passes ? "#16A34A" : "#DC2626"}
                  />
                  <Text
                    style={[
                      styles.resultText,
                      { color: passes ? "#166534" : "#991B1B" },
                    ]}
                    testID="frontage-result-text"
                  >
                    {passes
                      ? `Pass — ${(frontageValue / LOTS).toFixed(1)}m per lot`
                      : `Fail — need ${(REQUIRED_TOTAL - frontageValue).toFixed(1)}m more`}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, saved && styles.saveBtnActive]}
                onPress={handleSave}
                testID="save-property-btn"
              >
                <Ionicons
                  name={saved ? "bookmark" : "bookmark-outline"}
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.saveText}>
                  {saved ? "Saved" : "Save Property"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon} size={18} color="#0F172A" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  backdropTouch: { ...StyleSheet.absoluteFillObject },
  sheetWrap: { backgroundColor: "transparent" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "92%",
    paddingTop: 10,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 6,
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  hero: { width: "100%", height: 180, borderRadius: 16, backgroundColor: "#F1F5F9" },
  headerRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 16 },
  suburbTag: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: "#64748B",
    fontWeight: "700",
    marginBottom: 4,
  },
  address: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  price: { fontSize: 32, fontWeight: "800", color: "#0A0A0A", marginTop: 8, letterSpacing: -1 },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    gap: 2,
  },
  statValue: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  statLabel: { fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.6 },
  description: { fontSize: 14, color: "#475569", lineHeight: 20, marginTop: 16 },
  calcCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  calcHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  calcTitle: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  calcHint: { fontSize: 12, color: "#64748B", marginTop: 6, lineHeight: 17 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    marginTop: 12,
  },
  input: { flex: 1, fontSize: 18, fontWeight: "600", color: "#0F172A", paddingVertical: 12 },
  unit: { fontSize: 14, color: "#64748B", fontWeight: "600" },
  resultPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  resultPass: { backgroundColor: "#DCFCE7" },
  resultFail: { backgroundColor: "#FEE2E2" },
  resultText: { fontSize: 13, fontWeight: "700" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0A0A0A",
    height: 52,
    borderRadius: 14,
    marginTop: 18,
  },
  saveBtnActive: { backgroundColor: "#16A34A" },
  saveText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700", letterSpacing: 0.2 },
});
