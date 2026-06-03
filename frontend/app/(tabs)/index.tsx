import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../../lib/supabase";

import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  SUBURBS_ALL,
  getUniqueSuburbs,
} from "@/src/data/properties";

import PropertyDetailsModal from "@/src/components/PropertyDetailsModal";
import LeafletMap from "@/src/components/LeafletMap";

const PRICE_CAP_DEFAULT = 700000;
const LAND_SIZE_MIN_DEFAULT = 600;

export default function MapSearchScreen() {
  
  const [properties, setProperties] = useState<any[]>([]);
  useEffect(() => {
  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("*");

    if (!error) setProperties(data || []);
  };

  fetchProperties();
}, []);
  
  const [suburb, setSuburb] = useState<string>(SUBURBS_ALL);
  const [priceCap, setPriceCap] = useState<number>(PRICE_CAP_DEFAULT);
  const [minLand, setMinLand] = useState<number>(LAND_SIZE_MIN_DEFAULT);
  const [suburbOpen, setSuburbOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [landOpen, setLandOpen] = useState(false);
  const [selected, setSelected] = useState<Property | null>(null);

 const filtered = useMemo(() => {
  return properties.filter(
    (p) =>
      (suburb === SUBURBS_ALL || p.suburb === suburb) &&
      p.price <= priceCap &&
      p.landSize >= minLand,
  );
}, [properties, suburb, priceCap, minLand]);

  const suburbs = useMemo(() => getUniqueSuburbs(), []);

  const html = useMemo(() => buildLeafletHtml(filtered), [filtered]);

 const handleMarker = useCallback((id: string) => {
  const prop = properties.find((p) => p.id === id) ?? null;
  if (prop) setSelected(prop);
}, [properties]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.brand}>SplitFinder</Text>
        <Text style={styles.subtitle}>
          {filtered.length} subdivision-ready{" "}
          {filtered.length === 1 ? "property" : "properties"}
        </Text>
      </View>

      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
        >
          <FilterChip
            icon="location-outline"
            label="Suburb"
            value={suburb === SUBURBS_ALL ? "All" : suburb}
            onPress={() => setSuburbOpen(true)}
            testID="filter-chip-suburb"
          />
          <FilterChip
            icon="pricetag-outline"
            label="Price ≤"
            value={`$${(priceCap / 1000).toFixed(0)}k`}
            onPress={() => setPriceOpen(true)}
            testID="filter-chip-price"
          />
          <FilterChip
            icon="resize-outline"
            label="Land ≥"
            value={`${minLand}m²`}
            onPress={() => setLandOpen(true)}
            testID="filter-chip-land"
          />
        </ScrollView>
      </View>

      <View style={styles.mapContainer} testID="map-container">
        <LeafletMap html={html} onMarkerPress={handleMarker} />

        {filtered.length === 0 && (
          <View style={styles.emptyOverlay} pointerEvents="none">
            <Text style={styles.emptyText}>
              No properties match these filters.
            </Text>
          </View>
        )}
      </View>

      <SelectorModal
        visible={suburbOpen}
        title="Filter by suburb"
        options={suburbs}
        selected={suburb}
        onSelect={(v) => {
          setSuburb(v);
          setSuburbOpen(false);
        }}
        onClose={() => setSuburbOpen(false)}
        renderOption={(v) => v}
        testIDPrefix="suburb"
      />

      <NumericModal
        visible={priceOpen}
        title="Price Cap"
        prefix="$"
        suffix=""
        initial={priceCap}
        onApply={(v) => {
          setPriceCap(v);
          setPriceOpen(false);
        }}
        onClose={() => setPriceOpen(false)}
        testIDPrefix="price-cap"
      />

      <NumericModal
        visible={landOpen}
        title="Minimum Land Size"
        prefix=""
        suffix="m²"
        initial={minLand}
        onApply={(v) => {
          setMinLand(v);
          setLandOpen(false);
        }}
        onClose={() => setLandOpen(false)}
        testIDPrefix="land-min"
      />

      <PropertyDetailsModal
        property={selected}
        visible={!!selected}
        onClose={() => setSelected(null)}
      />
    </SafeAreaView>
  );
}

function FilterChip({
  icon,
  label,
  value,
  onPress,
  testID,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <TouchableOpacity style={styles.chip} onPress={onPress} testID={testID}>
      <Ionicons name={icon} size={14} color="#0A0A0A" />
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={styles.chipValue}>{value}</Text>
      <Ionicons name="chevron-down" size={14} color="#64748B" />
    </TouchableOpacity>
  );
}

function SelectorModal<T extends string>({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
  renderOption,
  testIDPrefix,
}: {
  visible: boolean;
  title: string;
  options: T[];
  selected: T;
  onSelect: (v: T) => void;
  onClose: () => void;
  renderOption: (v: T) => string;
  testIDPrefix: string;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={{ maxHeight: 340 }}>
            {options.map((opt) => {
              const isSel = opt === selected;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optionRow, isSel && styles.optionRowActive]}
                  onPress={() => onSelect(opt)}
                  testID={`${testIDPrefix}-option-${opt}`}
                >
                  <Text
                    style={[styles.optionText, isSel && styles.optionTextActive]}
                  >
                    {renderOption(opt)}
                  </Text>
                  {isSel && <Ionicons name="checkmark" size={18} color="#0A0A0A" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function NumericModal({
  visible,
  title,
  prefix,
  suffix,
  initial,
  onApply,
  onClose,
  testIDPrefix,
}: {
  visible: boolean;
  title: string;
  prefix: string;
  suffix: string;
  initial: number;
  onApply: (v: number) => void;
  onClose: () => void;
  testIDPrefix: string;
}) {
  const [text, setText] = useState(String(initial));
  React.useEffect(() => {
    if (visible) setText(String(initial));
  }, [visible, initial]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>{title}</Text>
          <View style={styles.numInputRow}>
            {prefix ? <Text style={styles.numAffix}>{prefix}</Text> : null}
            <TextInput
              value={text}
              onChangeText={setText}
              keyboardType="number-pad"
              style={styles.numInput}
              placeholderTextColor="#94A3B8"
              testID={`${testIDPrefix}-input`}
            />
            {suffix ? <Text style={styles.numAffix}>{suffix}</Text> : null}
          </View>
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => {
              const n = parseInt(text.replace(/[^0-9]/g, ""), 10);
              if (Number.isFinite(n) && n >= 0) onApply(n);
            }}
            testID={`${testIDPrefix}-apply`}
          >
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function buildLeafletHtml(props: Property[]) {
  const markers = props
    .map(
      (p) =>
        `addMarker(${p.latitude}, ${p.longitude}, ${JSON.stringify(p.id)}, ${JSON.stringify(
          `$${Math.round(p.price / 1000)}k`,
        )}, ${JSON.stringify(`${p.address}, ${p.suburb}`)});`,
    )
    .join("\n");

  const centerLat =
    props.length > 0
      ? props.reduce((s, p) => s + p.latitude, 0) / props.length
      : -28.5;
  const centerLng =
    props.length > 0
      ? props.reduce((s, p) => s + p.longitude, 0) / props.length
      : 134;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" />
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html,body,#map { height:100%; margin:0; padding:0; background:#F9FAFB; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
  .price-pin {
    background:#0A0A0A; color:#fff; padding:6px 10px; border-radius:999px;
    font-weight:700; font-size:12px; box-shadow:0 4px 10px rgba(0,0,0,0.25);
    white-space:nowrap; border:2px solid #fff;
  }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${centerLat}, ${centerLng}], ${props.length > 0 ? 4 : 4});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  var bounds = [];
  function addMarker(lat, lng, id, price, label) {
    var icon = L.divIcon({ className: '', html: '<div class="price-pin" data-id="'+id+'">'+price+'</div>', iconSize:[60,28], iconAnchor:[30,14] });
    var m = L.marker([lat,lng], { icon: icon }).addTo(map);
    m.bindTooltip(label, { direction:'top', offset:[0,-12] });
    m.on('click', function(){
      var payload = JSON.stringify({ type:'marker', id: id });
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(payload);
      if (window.parent && window.parent !== window) window.parent.postMessage(payload, '*');
    });
    bounds.push([lat,lng]);
  }
  ${markers}
  if (bounds.length > 1) map.fitBounds(bounds, { padding: [40,40] });
  else if (bounds.length === 1) map.setView(bounds[0], 11);
</script>
</body></html>`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  brand: { fontSize: 24, fontWeight: "800", color: "#0A0A0A", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: "#64748B", marginTop: 2 },
  filterBar: { paddingVertical: 12 },
  chipScroll: { paddingHorizontal: 20, gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  chipLabel: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  chipValue: { fontSize: 13, color: "#0A0A0A", fontWeight: "700" },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  webview: { flex: 1, backgroundColor: "#F9FAFB" },
  emptyOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(249,250,251,0.85)",
    pointerEvents: "none",
  },
  emptyText: { fontSize: 14, color: "#64748B", fontWeight: "600" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalSheet: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: { fontSize: 17, fontWeight: "700", color: "#0F172A", marginBottom: 12 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionRowActive: { backgroundColor: "#F1F5F9" },
  optionText: { fontSize: 15, color: "#0F172A" },
  optionTextActive: { fontWeight: "700" },
  numInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  numAffix: { fontSize: 18, color: "#64748B", fontWeight: "600" },
  numInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  applyBtn: {
    marginTop: 16,
    backgroundColor: "#0A0A0A",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
