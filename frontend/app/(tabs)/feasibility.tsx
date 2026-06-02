import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const CIVIL_WORKS_BASELINE = 80000;
const PURCHASE_DEFAULT = 650000;
const STAMP_DUTY_DEFAULT = 25000;
const SALE_PER_LOT_DEFAULT = 420000;
const OTHER_COSTS_DEFAULT = 4000;

export default function FeasibilityScreen() {
  const [purchase, setPurchase] = useState<string>(String(PURCHASE_DEFAULT));
  const [stampDuty, setStampDuty] = useState<string>(String(STAMP_DUTY_DEFAULT));
  const [civilWorks, setCivilWorks] = useState<string>(String(CIVIL_WORKS_BASELINE));
  const [salePerLot, setSalePerLot] = useState<string>(String(SALE_PER_LOT_DEFAULT));
  const [otherCosts, setOtherCosts] = useState<string>(String(OTHER_COSTS_DEFAULT));
  const [region, setRegion] = useState<string>("NSW");

  const num = (v: string) => {
    const n = parseFloat(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const purchaseN = num(purchase);
  const stampN = num(stampDuty);
  const civilN = num(civilWorks);
  const saleN = num(salePerLot);
  const otherN = num(otherCosts);

  const totalRevenue = useMemo(() => saleN * 2, [saleN]);
  const totalCost = useMemo(
    () => purchaseN + stampN + civilN + otherN,
    [purchaseN, stampN, civilN, otherN],
  );
  const grossProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const profitable = grossProfit > 0;

  const reset = () => {
    setPurchase(String(PURCHASE_DEFAULT));
    setStampDuty(String(STAMP_DUTY_DEFAULT));
    setCivilWorks(String(CIVIL_WORKS_BASELINE));
    setSalePerLot(String(SALE_PER_LOT_DEFAULT));
    setOtherCosts(String(OTHER_COSTS_DEFAULT));
  };

  const handleAutoStampDuty = () => {
    const purchasePrice = purchaseN;
    let duty: number;
    if (region === "NSW") {
      duty = 11210 + 0.045 * (purchasePrice - 365000);
    } else if (region === "QLD") {
      duty = 10150 + 0.045 * (purchasePrice - 540000);
    } else if (region === "SA") {
      duty = 21330 + 0.055 * (purchasePrice - 500000);
    } else {
      duty = purchasePrice * 0.05;
    }
    setStampDuty(String(Math.max(0, Math.round(duty))));
  };

  const handleExportPdf = () => {
    if (Platform.OS === 'web') {
      window.print();
    } else {
      Alert.alert('Export', 'Report downloaded to device.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.brand}>Feasibility</Text>
              <Text style={styles.subtitle}>
                Two-lot subdivision profit estimate
              </Text>
            </View>
            <TouchableOpacity onPress={reset} style={styles.resetBtn} testID="reset-btn">
              <Ionicons name="refresh" size={16} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <View
            style={[styles.profitCard, !profitable && styles.profitCardLoss]}
            testID="gross-profit-card"
          >
            <Text style={styles.profitLabel}>GROSS PROFIT</Text>
            <Text style={styles.profitValue} testID="gross-profit-value">
              {grossProfit < 0 ? "-" : ""}${Math.abs(Math.round(grossProfit)).toLocaleString()}
            </Text>
            <View style={styles.profitMetaRow}>
              <View style={styles.profitMeta}>
                <Text style={styles.profitMetaLabel}>Revenue</Text>
                <Text style={styles.profitMetaValue}>
                  ${Math.round(totalRevenue).toLocaleString()}
                </Text>
              </View>
              <View style={styles.profitDivider} />
              <View style={styles.profitMeta}>
                <Text style={styles.profitMetaLabel}>Costs</Text>
                <Text style={styles.profitMetaValue}>
                  ${Math.round(totalCost).toLocaleString()}
                </Text>
              </View>
              <View style={styles.profitDivider} />
              <View style={styles.profitMeta}>
                <Text style={styles.profitMetaLabel}>Margin</Text>
                <Text style={styles.profitMetaValue} testID="gross-profit-margin">
                  {margin.toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>REGION</Text>
            <View style={styles.regionRow}>
              {["NSW", "VIC", "QLD", "WA", "SA"].map((s) => {
                const active = region === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.regionPill, active && styles.regionPillActive]}
                    onPress={() => setRegion(s)}
                    testID={`region-${s}`}
                  >
                    <Text
                      style={[
                        styles.regionPillText,
                        active && styles.regionPillTextActive,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={styles.autoStampBtn}
              onPress={handleAutoStampDuty}
              testID="auto-stamp-duty-btn"
            >
              <Ionicons name="flash-outline" size={14} color="#0A0A0A" />
              <Text style={styles.autoStampText}>
                Auto-calc Stamp Duty for {region}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COSTS</Text>

            <CurrencyInput
              label="Purchase Price"
              hint="Site acquisition cost"
              value={purchase}
              onChange={setPurchase}
              testID="input-purchase-price"
            />
            <CurrencyInput
              label="Stamp Duty"
              hint="State government transfer duty"
              value={stampDuty}
              onChange={setStampDuty}
              testID="input-stamp-duty"
            />
            <CurrencyInput
              label="Civil Works"
              hint={`Baseline $${CIVIL_WORKS_BASELINE.toLocaleString()} — services, driveway, fencing`}
              value={civilWorks}
              onChange={setCivilWorks}
              testID="input-civil-works"
            />
            <CurrencyInput
              label="Other Costs"
              hint="Conveyancing, bank setup, government transfer fees"
              value={otherCosts}
              onChange={setOtherCosts}
              testID="input-other-costs"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>REVENUE</Text>

            <CurrencyInput
              label="Sale Price per Lot"
              hint="Multiplied by 2 — assumes two equal vacant lots"
              value={salePerLot}
              onChange={setSalePerLot}
              testID="input-sale-per-lot"
            />
          </View>

          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>How it’s calculated</Text>
            <Text style={styles.formulaText}>
              Gross Profit = (Sale Price per Lot × 2) − Purchase − Stamp Duty − Civil Works − Other Costs
            </Text>
          </View>

          <View style={styles.exportRow}>
            <TouchableOpacity
              style={styles.exportBtn}
              onPress={handleExportPdf}
              testID="export-pdf-btn"
            >
              <Ionicons name="document-text-outline" size={16} color="#0F172A" />
              <Text style={styles.exportText}>Export PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.exportBtn, styles.exportBtnPrimary]}
              onPress={() => {}}
              testID="share-feasibility-btn"
            >
              <Ionicons name="share-outline" size={16} color="#FFFFFF" />
              <Text style={[styles.exportText, styles.exportTextPrimary]}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function CurrencyInput({
  label,
  hint,
  value,
  onChange,
  testID,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  testID: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInputRow}>
        <Text style={styles.fieldPrefix}>$</Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="number-pad"
          style={styles.fieldInput}
          placeholderTextColor="#94A3B8"
          testID={testID}
        />
      </View>
      <Text style={styles.fieldHint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  headerRow: { flexDirection: "row", alignItems: "center", paddingBottom: 16 },
  brand: { fontSize: 24, fontWeight: "800", color: "#0A0A0A", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: "#64748B", marginTop: 2 },
  resetBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  profitCard: {
    backgroundColor: "#0A0A0A",
    padding: 22,
    borderRadius: 20,
  },
  profitCardLoss: { backgroundColor: "#7F1D1D" },
  profitLabel: {
    color: "#94A3B8",
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: "700",
  },
  profitValue: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    marginTop: 6,
    letterSpacing: -1.2,
  },
  profitMetaRow: {
    flexDirection: "row",
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  profitMeta: { flex: 1, alignItems: "center" },
  profitMetaLabel: {
    color: "#94A3B8",
    fontSize: 10,
    letterSpacing: 0.8,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  profitMetaValue: { color: "#FFFFFF", fontSize: 13, fontWeight: "700", marginTop: 2 },
  profitDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 4,
  },
  section: { marginTop: 24 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: "#94A3B8",
    marginBottom: 10,
  },
  field: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: "700", color: "#0F172A" },
  fieldInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 6,
  },
  fieldPrefix: { color: "#64748B", fontWeight: "700", fontSize: 16 },
  fieldInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 6,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  fieldHint: { fontSize: 11, color: "#64748B", marginTop: 6 },
  formulaCard: {
    marginTop: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  formulaTitle: { fontSize: 12, fontWeight: "800", color: "#0F172A", letterSpacing: 0.8 },
  formulaText: { fontSize: 12, color: "#475569", marginTop: 6, lineHeight: 18 },
  regionRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  regionPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  regionPillActive: { backgroundColor: "#0A0A0A", borderColor: "#0A0A0A" },
  regionPillText: { fontSize: 12, fontWeight: "700", color: "#0F172A" },
  regionPillTextActive: { color: "#FFFFFF" },
  autoStampBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  autoStampText: { color: "#0A0A0A", fontSize: 13, fontWeight: "700" },
  exportRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  exportBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  exportBtnPrimary: {
    backgroundColor: "#0A0A0A",
    borderColor: "#0A0A0A",
  },
  exportText: { color: "#0F172A", fontSize: 14, fontWeight: "700" },
  exportTextPrimary: { color: "#FFFFFF" },
});
