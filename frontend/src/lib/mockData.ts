// Full-Scale Industrial Commerce Intelligence Mock Dataset (500+ SKUs)

const CATEGORIES = ["Pumps", "Valves", "Motors", "Bearings", "Compressors", "Sensors", "Controllers", "Robotics"];
const MATERIALS = ["Stainless Steel 316", "Cast Iron GG25", "Carbon Steel A216", "Aluminum Alloy", "Titanium Grade 2", "Brass / Bronze"];
const SUPPLIERS = [
  { name: "Grundfos Pumps India Ltd", location: "Chennai, TN", quality: 98, delivery: 96, risk: "Low", status: "Vetted Tier-1" },
  { name: "Siemens Industry Automation", location: "Mumbai, MH", quality: 99, delivery: 98, risk: "Low", status: "Vetted Tier-1" },
  { name: "KSB Pumps & Valves Corp", location: "Pune, MH", quality: 95, delivery: 92, risk: "Low", status: "Vetted Tier-1" },
  { name: "SKF Bearings International", location: "Bengaluru, KA", quality: 97, delivery: 95, risk: "Low", status: "Vetted Tier-1" },
  { name: "Danfoss Power Systems", location: "New Delhi, DL", quality: 94, delivery: 91, risk: "Low", status: "Vetted Tier-1" },
  { name: "Atlas Copco Industrial Air", location: "Hyderabad, TS", quality: 98, delivery: 97, risk: "Low", status: "Vetted Tier-1" },
  { name: "ABB Motion & Robotics", location: "Vadodara, GJ", quality: 99, delivery: 94, risk: "Low", status: "Vetted Tier-1" },
  { name: "Endress+Hauser Instrumentation", location: "Aurangabad, MH", quality: 96, delivery: 93, risk: "Low", status: "Vetted Tier-1" },
  { name: "Parker Hannifin Hydraulics", location: "Noida, UP", quality: 93, delivery: 89, risk: "Medium", status: "Certified" },
  { name: "Emerson Automation Solutions", location: "Kolkata, WB", quality: 95, delivery: 90, risk: "Low", status: "Vetted Tier-1" }
];

const PRODUCT_PREFIXES: Record<string, string[]> = {
  Pumps: ["CR 32-4 Vertical Multistage", "Movitec Inline Booster", "Mega-CPK End Suction", "Sulzer Process Chemical", "Flowserve Mark 3 ANSI", "Wilton Heavy Slurry", "Flygt Submersible Dewatering", "Milton Roy Dosing Metering"],
  Valves: ["Triple Offset Butterfly DN200", "Forged Steel Gate Valve Class 800", "Pneumatic Control Globe Valve", "API 6D Trunnion Ball Valve", "Pressure Safety Relief Valve", "Dual Plate Check Valve", "Solenoid Pilot Operated Valve", "Cryogenic Needle Valve"],
  Motors: ["150kW 3-Phase IE4 Super Premium", "Explosion Proof Flameproof Motor", "High-Torque AC Servo Motor", "PM Synchronous Gearless Drive", "NEMA Premium Cast Iron Motor", "Submersible Well Pump Motor", "Brake Motor Duty S4", "Variable Speed Inverter Duty Motor"],
  Bearings: ["Spherical Roller Bearing 22220", "Deep Groove Ball Bearing 6215-2RS", "Tapered Roller Bearing 32218", "Angular Contact Ball Bearing 7314", "Thrust Cylindrical Roller Bearing", "Ceramic Hybrid High Speed Bearing", "Split Plummer Block Housing Unit", "Slewing Ring Bearing External Gear"],
  Compressors: ["Rotary Screw Air Compressor 75kW", "Two-Stage Reciprocating Industrial", "Oil-Free Centrifugal Compressor", "Scroll Silent Medical Air Unit", "Variable Frequency Drive Compressor", "High Pressure PET Bottle Compressor", "Portable Diesel Towable Compressor", "Refrigerated Air Dryer Combo"],
  Sensors: ["Smart Vibration Telemetry Sensor", "Radar Non-Contact Level Transmitter", "Coriolis Mass Flow Meter DN50", "Piezoresistive Pressure Transmitter", "Thermocouple Assembly Type K", "Ultrasonic Doppler Flow Sensor", "Gas Leak Infrared Detector", "Photoelectric Distance Sensor"],
  Controllers: ["S7-1500 Modular PLC CPU 1516", "RX3i PACSystem Programmable Controller", "15-Inch Industrial Touch HMI Panel", "ACS880 Industrial Drive Module", "CompactLogix 5380 Controller", "Safety PLC GuardLogix", "Distributed I/O Node EtherNet/IP", "SCADA Gateway RTU Module"],
  Robotics: ["6-Axis Heavy Payload Robot Arm", "SCARA High Speed Assembly Arm", "Cobot Collaborative Robot 10kg", "Delta Picker & Packer Robot", "AGV Autonomous Mobile Transporter", "Robotic Welding Cell ArcWorld", "Palletizing Robot 4-Axis", "Inspection Vision Robot Node"]
};

export function generate500Products() {
  const products = [];
  let id = 1;

  for (let i = 0; i < 500; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const prefixes = PRODUCT_PREFIXES[category];
    const prefix = prefixes[i % prefixes.length];
    const supplier = SUPPLIERS[i % SUPPLIERS.length];
    const material = MATERIALS[i % MATERIALS.length];

    const basePrice = Math.floor(15000 + ((i * 34771) % 4850000));
    const aiScore = Math.floor(82 + ((i * 17) % 18));
    const qualityScore = Math.floor(88 + ((i * 13) % 12));
    const reliabilityScore = Math.floor(85 + ((i * 19) % 15));
    const valueScore = Math.floor(80 + ((i * 23) % 19));

    products.push({
      id: id,
      name: `${prefix} SKU-${1000 + id}`,
      sku: `${category.substring(0, 3).toUpperCase()}-${supplier.name.substring(0, 3).toUpperCase()}-${2000 + id}`,
      category: category,
      sub_category: `${category} Engineering Grade ${((id % 5) + 1)}`,
      price: basePrice,
      ai_score: aiScore,
      quality_score: qualityScore,
      reliability_score: reliabilityScore,
      value_score: valueScore,
      supplier_name: supplier.name,
      material: material,
      availability: id % 3 === 0 ? "In Stock (Ships in 24h)" : id % 3 === 1 ? "Lead Time: 3-5 Days" : "Factory Direct (10 Days)",
      warranty_months: id % 2 === 0 ? 24 : 36,
      rating: parseFloat((4.3 + (id % 8) * 0.1).toFixed(1)),
      reviews_count: 14 + (id % 180),
      description: `High-performance ${category.toLowerCase()} designed for heavy-duty industrial process application. Manufactured with ${material} casing for extreme heat & corrosion resistance.`,
      specifications: [
        { key: "Material Construction", value: material },
        { key: "Operating Temperature", value: "-20°C to +280°C" },
        { key: "Pressure Rating", value: "PN16 / ANSI Class 300" },
        { key: "Efficiency Grade", value: "IE4 Super Premium" },
        { key: "Certification", value: "ISO 9001, CE, ATEX Zone 1" }
      ]
    });
    id++;
  }

  return products;
}

export const MOCK_PRODUCTS = generate500Products();
export const MOCK_SUPPLIERS = SUPPLIERS.map((s, idx) => ({
  id: idx + 1,
  name: s.name,
  location: s.location,
  quality_score: s.quality,
  delivery_score: s.delivery,
  risk_score: s.risk,
  verification_status: s.status,
  ai_score: 90 + (idx % 9)
}));

export const MOCK_ORDERS = [
  { id: 1, order_number: "PO-2026-8849", total_amount: 1450000, payment_status: "Paid", delivery_status: "In Transit", supplier_name: "Grundfos Pumps India Ltd" },
  { id: 2, order_number: "PO-2026-8850", total_amount: 890000, payment_status: "Paid", delivery_status: "Delivered", supplier_name: "Siemens Industry Automation" },
  { id: 3, order_number: "PO-2026-8851", total_amount: 3200000, payment_status: "Pending", delivery_status: "Processing", supplier_name: "ABB Motion & Robotics" }
];

export const MOCK_PROCUREMENT_REQUESTS = [
  { id: 1, product_name: "Grundfos CR 32-4 Vertical Multistage Pump", quantity: 5, budget: 1500000, status: "Quotes Received" },
  { id: 2, product_name: "Siemens 150kW 3-Phase IE4 Motor", quantity: 2, budget: 950000, status: "Under Review" },
  { id: 3, product_name: "Triple Offset Butterfly Valve DN200", quantity: 12, budget: 600000, status: "Open RFQ" }
];

export const MOCK_QUOTES = [
  { id: 1, supplier_name: "Grundfos Pumps India Ltd", unit_price: 245000, total_cost: 1225000, delivery_days: 5, warranty: "24 Months" },
  { id: 2, supplier_name: "KSB Pumps & Valves Corp", unit_price: 238000, total_cost: 1190000, delivery_days: 7, warranty: "12 Months" },
  { id: 3, supplier_name: "Flowserve India", unit_price: 260000, total_cost: 1300000, delivery_days: 3, warranty: "36 Months" }
];
