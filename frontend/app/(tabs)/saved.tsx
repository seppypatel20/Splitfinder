import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
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
import { useFocusEffect } from "expo-router";

import { PROPERTIES, Property } from "@/src/data/properties";
import { getSavedIds, removeSaved } from "@/src/utils/savedProperties";
import PropertyDetailsModal from "@/src/components/PropertyDetailsModal";

export default function SavedScreen() {
  const [savedProps, setSavedProps] = useState<Property[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selected, setSelected] = useState<Property | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [draftAddress, setDraftAddress] = useState("");
  const [draftSuburb, setDraftSuburb] = useState("");
  const [draftCity, setDraftCity] = useState("");
  const [draftState, setDraftState] = useState("");
  const [draftPrice, setDraftPrice] = useState("");
  const [draftLand, setDraftLand] = useState("");
  const [draftFrontage, setDraftFrontage] = useState("");
  const [draftBeds, setDraftBeds] = useState("");
  const [draftBaths, setDraftBaths] = useState("");
  const [draftImage, setDraftImage] = useState("");

  const closeAdd = () => setAddOpen(false);

  const resetDraft = () => {
    setDraftAddress("");
    setDraftSuburb("");
    setDraftCity("");
    setDraftState("");
    setDraftPrice("");
    setDraftLand("");
    setDraftFrontage("");
    setDraftBeds("");
    setDraftBaths("");
    setDraftImage("");
  };

  const handleSaveDraft = () => {
    const toNum = (s: string) => {
      const n = parseFloat(s.replace(/[^0-9.]/g, ""));
      return Number.isFinite(n) ? n : 0;
    };
    const newProp: Property = {
      id: `user-${Date.now()}`,
      address: draftAddress.trim() || "Untitled property",
      suburb: draftSuburb.trim() || "—",
      city: draftCity.trim() || "—",
      state: draftState || "—",
      price: toNum(draftPrice),
      landSize: toNum(draftLand),
      frontage: toNum(draftFrontage),
      bedrooms: toNum(draftBeds),
      bathrooms: toNum(draftBaths),
      latitude: 0,
      longitude: 0,
      imageUrl:
        draftImage.trim() ||
        "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      description: "User-added property.",
    };
    setProperties((prev) => [newProp, ...prev]);
    resetDraft();
    setAddOpen(false);
  };

  const load = useCallback(async () => {
    const ids = await getSavedIds();
    const list = ids
      .map((id) => PROPERTIES.find((p) => p.id === id))
      .filter((p): p is Property => !!p);
    setSavedProps(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleUnsave = async (id: string) => {
    if (id.startsWith("user-")) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    await removeSaved(id);
    load();
  };

  const combined = [...properties, ...savedProps];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>Saved Properties</Text>
          <Text style={styles.subtitle}>
            {combined.length} {combined.length === 1 ? "property" : "properties"} shortlisted
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setAddOpen(true)}
          testID="add-property-btn"
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {combined.length === 0 ? (
        <View style={styles.empty} testID="saved-empty">
          <View style={styles.emptyIcon}>
            <Ionicons name="bookmark-outline" size={28} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>No saved properties yet</Text>
          <Text style={styles.emptyText}>
            Tap a pin on the map and save it to build your subdivision watchlist.
          </Text>
        </View>
      ) : (
        <FlatList
          data={combined}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelected(item)}
              testID={`saved-card-${item.id}`}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.thumb}
                contentFit="cover"
                transition={150}
              />
              <View style={styles.cardBody}>
                <Text style={styles.cardSuburb}>
                  {item.suburb.toUpperCase()} · {item.state}
                </Text>
                <Text style={styles.cardAddress} numberOfLines={1}>
                  {item.address}
                </Text>
                <Text style={styles.cardPrice}>
                  ${item.price.toLocaleString()}
                </Text>
                <View style={styles.metaRow}>
                  <Meta label={`${item.landSize}m²`} />
                  <Meta label={`${item.frontage}m frontage`} />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleUnsave(item.id)}
                style={styles.unsave}
                hitSlop={10}
                testID={`unsave-property-btn-${item.id}`}
              >
                <Ionicons name="close" size={16} color="#0F172A" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      <PropertyDetailsModal
        property={selected}
        visible={!!selected}
        onClose={() => setSelected(null)}
        onSavedChange={load}
      />

      <Modal
        visible={addOpen}
        animationType="slide"
        transparent
        onRequestClose={closeAdd}
      >
        <Pressable style={addStyles.backdrop} onPress={closeAdd}>
          <Pressable style={addStyles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={addStyles.handle} />
            <View style={addStyles.headerRow}>
              <Text style={addStyles.title}>Add Property</Text>
              <TouchableOpacity
                onPress={closeAdd}
                style={addStyles.closeBtn}
                testID="add-property-close"
              >
                <Ionicons name="close" size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <Text style={addStyles.subtitle}>
              Manually add an off-market property to your watchlist.
            </Text>

            <ScrollView
              style={{ maxHeight: 420 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <FormField
                label="Street Address"
                placeholder="e.g. 12 Example Street"
                value={draftAddress}
                onChange={setDraftAddress}
                testID="draft-address"
              />
              <View style={addStyles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <FormField
                    label="Suburb"
                    placeholder="e.g. Parramatta"
                    value={draftSuburb}
                    onChange={setDraftSuburb}
                    testID="draft-suburb"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <FormField
                    label="City"
                    placeholder="e.g. Sydney"
                    value={draftCity}
                    onChange={setDraftCity}
                    testID="draft-city"
                  />
                </View>
              </View>

              <Text style={addStyles.fieldLabel}>State</Text>
              <View style={addStyles.statesRow}>
                {["NSW", "VIC", "QLD", "WA", "SA"].map((s) => {
                  const active = draftState === s;
                  return (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setDraftState(s)}
                      style={[addStyles.statePill, active && addStyles.statePillActive]}
                      testID={`draft-state-${s}`}
                    >
                      <Text
                        style={[
                          addStyles.statePillText,
                          active && addStyles.statePillTextActive,
                        ]}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={addStyles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <FormField
                    label="Price ($)"
                    placeholder="650000"
                    value={draftPrice}
                    onChange={setDraftPrice}
                    keyboardType="number-pad"
                    testID="draft-price"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <FormField
                    label="Land Size (m²)"
                    placeholder="620"
                    value={draftLand}
                    onChange={setDraftLand}
                    keyboardType="number-pad"
                    testID="draft-land"
                  />
                </View>
              </View>

              <View style={addStyles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <FormField
                    label="Frontage (m)"
                    placeholder="20"
                    value={draftFrontage}
                    onChange={setDraftFrontage}
                    keyboardType="decimal-pad"
                    testID="draft-frontage"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <FormField
                    label="Beds"
                    placeholder="3"
                    value={draftBeds}
                    onChange={setDraftBeds}
                    keyboardType="number-pad"
                    testID="draft-beds"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <FormField
                    label="Baths"
                    placeholder="2"
                    value={draftBaths}
                    onChange={setDraftBaths}
                    keyboardType="number-pad"
                    testID="draft-baths"
                  />
                </View>
              </View>

              <FormField
                label="Photo URL (optional)"
                placeholder="https://…"
                value={draftImage}
                onChange={setDraftImage}
                testID="draft-image"
              />
            </ScrollView>

            <View style={addStyles.actionsRow}>
              <TouchableOpacity
                onPress={closeAdd}
                style={addStyles.cancelBtn}
                testID="add-property-cancel"
              >
                <Text style={addStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveDraft}
                style={addStyles.saveBtn}
                testID="add-property-save"
              >
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                <Text style={addStyles.saveText}>Save Property</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
  keyboardType,
  testID,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: "default" | "number-pad" | "decimal-pad";
  testID: string;
}) {
  return (
    <View style={addStyles.field}>
      <Text style={addStyles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType ?? "default"}
        style={addStyles.input}
        testID={testID}
      />
    </View>
  );
}

function Meta({ label }: { label: string }) {
  return (
    <View style={styles.metaPill}>
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  brand: { fontSize: 24, fontWeight: "800", color: "#0A0A0A", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: "#64748B", marginTop: 2 },
  list: { paddingHorizontal: 20, paddingBottom: 24, gap: 12 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  thumb: { width: 92, height: 92, borderRadius: 12, backgroundColor: "#F1F5F9" },
  cardBody: { flex: 1, paddingHorizontal: 12, justifyContent: "center" },
  cardSuburb: { fontSize: 10, color: "#64748B", fontWeight: "700", letterSpacing: 1 },
  cardAddress: { fontSize: 14, color: "#0F172A", fontWeight: "700", marginTop: 2 },
  cardPrice: { fontSize: 16, color: "#0A0A0A", fontWeight: "800", marginTop: 2 },
  metaRow: { flexDirection: "row", gap: 6, marginTop: 6 },
  metaPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaText: { fontSize: 10, fontWeight: "700", color: "#475569" },
  unsave: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  emptyText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#0A0A0A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  addBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
});

const addStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: { flex: 1, fontSize: 20, fontWeight: "800", color: "#0F172A" },
  subtitle: { fontSize: 12, color: "#64748B", marginTop: 2, marginBottom: 14 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  field: { marginBottom: 12 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: 0.6,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0F172A",
  },
  row: { flexDirection: "row" },
  statesRow: { flexDirection: "row", gap: 6, marginBottom: 14, flexWrap: "wrap" },
  statePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  statePillActive: { backgroundColor: "#0A0A0A", borderColor: "#0A0A0A" },
  statePillText: { fontSize: 12, fontWeight: "700", color: "#0F172A" },
  statePillTextActive: { color: "#FFFFFF" },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  cancelText: { color: "#0F172A", fontSize: 14, fontWeight: "700" },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#0A0A0A",
  },
  saveText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
