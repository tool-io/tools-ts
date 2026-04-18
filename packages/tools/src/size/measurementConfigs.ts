import type { MeasurementSizeConfig } from "./measurementTool.js";

export const beltConfig = {
  kind: "belt",
  name: "Belt Size Comparison",
  intro:
    "Estimate belt labels and finished length from the waist position where the belt will be worn.",
  fields: {
    waist: {
      defaultCm: 86,
      label: "Waist at belt position",
      minCm: 40,
      maxCm: 180,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const collarConfig = {
  kind: "collar",
  name: "Collar Size Comparison",
  intro:
    "Convert neck circumference into common metric and inch collar labels with a practical comfort allowance.",
  fields: {
    neck: {
      defaultCm: 39,
      label: "Neck circumference",
      minCm: 20,
      maxCm: 80,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const dressConfig = {
  kind: "dress",
  name: "Dress Size Comparison",
  intro:
    "Estimate an international dress size from bust, waist, and hip circumference.",
  fields: {
    bust: {
      defaultCm: 92,
      label: "Bust circumference",
      minCm: 50,
      maxCm: 180,
    },
    waist: {
      defaultCm: 74,
      label: "Waist circumference",
      minCm: 40,
      maxCm: 170,
    },
    hip: {
      defaultCm: 100,
      label: "Hip circumference",
      minCm: 50,
      maxCm: 190,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const dressShirtConfig = {
  kind: "dress-shirt",
  name: "Dress Shirt Size Comparison",
  intro:
    "Estimate dress-shirt collar and sleeve labels from neck circumference and sleeve length.",
  fields: {
    neck: {
      defaultCm: 40,
      label: "Neck circumference",
      minCm: 20,
      maxCm: 80,
    },
    sleeve: {
      defaultCm: 86,
      label: "Sleeve length",
      minCm: 40,
      maxCm: 120,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const glovesConfig = {
  kind: "gloves",
  name: "Glove Size Comparison",
  intro:
    "Estimate glove size from hand circumference measured around the knuckles without the thumb.",
  fields: {
    hand: {
      defaultCm: 21,
      label: "Hand circumference",
      minCm: 10,
      maxCm: 40,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const pantsConfig = {
  kind: "pants",
  name: "Pants Size Comparison",
  intro:
    "Estimate waist labels and inseam notation from body waist, hip, and inside-leg measurements.",
  fields: {
    waist: {
      defaultCm: 86,
      label: "Waist circumference",
      minCm: 40,
      maxCm: 200,
    },
    hip: {
      defaultCm: 102,
      label: "Hip circumference",
      minCm: 50,
      maxCm: 220,
    },
    inseam: {
      defaultCm: 81,
      label: "Inside leg",
      minCm: 30,
      maxCm: 130,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const ringConfig = {
  kind: "ring",
  name: "Ring Size Comparison",
  intro:
    "Compare ISO circumference, inner diameter, US, UK, Japanese, and European ring labels.",
  fields: {
    circumference: {
      defaultCm: 5.44,
      label: "Finger circumference",
      minCm: 3.5,
      maxCm: 9,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const shawlConfig = {
  kind: "shawl",
  name: "Shawl Size Guide",
  intro:
    "Classify rectangular shawl dimensions and compare metric and US customary measurements.",
  fields: {
    width: {
      defaultCm: 70,
      label: "Width",
      minCm: 15,
      maxCm: 250,
    },
    length: {
      defaultCm: 180,
      label: "Length",
      minCm: 40,
      maxCm: 400,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const smartRingConfig = {
  kind: "smart-ring",
  name: "Smart Ring Size Comparison",
  intro:
    "Estimate a conventional ring size as a starting point for a smart-ring sizing kit.",
  fields: {
    circumference: {
      defaultCm: 5.7,
      label: "Finger circumference",
      minCm: 3.5,
      maxCm: 9,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const socksConfig = {
  kind: "socks",
  name: "Sock Size Comparison",
  intro: "Estimate common sock labels from heel-to-longest-toe foot length.",
  fields: {
    footLength: {
      defaultCm: 27,
      label: "Foot length",
      minCm: 8,
      maxCm: 40,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const suitJacketConfig = {
  kind: "suit-jacket",
  name: "Suit Jacket Size Comparison",
  intro:
    "Estimate US, UK, and European jacket labels from chest circumference and body height.",
  fields: {
    chest: {
      defaultCm: 102,
      label: "Chest circumference",
      minCm: 50,
      maxCm: 200,
    },
    height: {
      defaultCm: 178,
      label: "Body height",
      minCm: 120,
      maxCm: 230,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const sweaterConfig = {
  kind: "sweater",
  name: "Sweater Size Comparison",
  intro: "Estimate an alpha sweater size from chest circumference.",
  fields: {
    chest: {
      defaultCm: 102,
      label: "Chest circumference",
      minCm: 50,
      maxCm: 200,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const tShirtConfig = {
  kind: "t-shirt",
  name: "T-Shirt Size Comparison",
  intro: "Estimate an alpha T-shirt size from chest circumference.",
  fields: {
    chest: {
      defaultCm: 102,
      label: "Chest circumference",
      minCm: 50,
      maxCm: 200,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const watchBandConfig = {
  kind: "watch-band",
  name: "Watch Band Size Guide",
  intro:
    "Estimate band length from wrist circumference and compare metric and inch measurements.",
  fields: {
    wrist: {
      defaultCm: 17,
      label: "Wrist circumference",
      minCm: 8,
      maxCm: 35,
    },
  },
} as const satisfies MeasurementSizeConfig;

export const babyClothingConfig = {
  fields: {
    height: {
      defaultCm: 74,
      label: "Body height",
      maxCm: 130,
      minCm: 40,
      quantity: "length",
    },
    chest: {
      defaultCm: 50,
      label: "Chest circumference",
      maxCm: 100,
      minCm: 30,
      quantity: "length",
    },
  },
  intro: "Compare baby clothing measurements in metric and US customary units.",
  kind: "baby-clothing",
  mode: "body",
  name: "Baby Clothing Size Guide",
} as const satisfies MeasurementSizeConfig;

export const blazerConfig = {
  fields: {
    chest: {
      defaultCm: 102,
      label: "Chest circumference",
      maxCm: 200,
      minCm: 50,
      quantity: "length",
    },
    waist: {
      defaultCm: 88,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 40,
      quantity: "length",
    },
    height: {
      defaultCm: 178,
      label: "Body height",
      maxCm: 230,
      minCm: 120,
      quantity: "length",
    },
  },
  intro: "Compare blazer measurements in metric and US customary units.",
  kind: "blazer",
  mode: "body",
  name: "Blazer Size Guide",
} as const satisfies MeasurementSizeConfig;

export const braConfig = {
  fields: {
    bust: {
      defaultCm: 92,
      label: "Full bust circumference",
      maxCm: 200,
      minCm: 55,
      quantity: "length",
    },
    underbust: {
      defaultCm: 78,
      label: "Snug underbust circumference",
      maxCm: 180,
      minCm: 45,
      quantity: "length",
    },
  },
  intro: "Compare bra measurements in metric and US customary units.",
  kind: "bra",
  mode: "body",
  name: "Bra Size Guide",
} as const satisfies MeasurementSizeConfig;

export const childrenClothingConfig = {
  fields: {
    height: {
      defaultCm: 128,
      label: "Body height",
      maxCm: 190,
      minCm: 70,
      quantity: "length",
    },
    chest: {
      defaultCm: 66,
      label: "Chest circumference",
      maxCm: 130,
      minCm: 40,
      quantity: "length",
    },
    waist: {
      defaultCm: 58,
      label: "Waist circumference",
      maxCm: 120,
      minCm: 35,
      quantity: "length",
    },
  },
  intro:
    "Compare children clothing measurements in metric and US customary units.",
  kind: "children-clothing",
  mode: "body",
  name: "Children Clothing Size Guide",
} as const satisfies MeasurementSizeConfig;

export const coatConfig = {
  fields: {
    chest: {
      defaultCm: 102,
      label: "Chest circumference",
      maxCm: 200,
      minCm: 50,
      quantity: "length",
    },
    waist: {
      defaultCm: 88,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 40,
      quantity: "length",
    },
    height: {
      defaultCm: 178,
      label: "Body height",
      maxCm: 230,
      minCm: 120,
      quantity: "length",
    },
  },
  intro: "Compare coat measurements in metric and US customary units.",
  kind: "coat",
  mode: "body",
  name: "Coat Size Guide",
} as const satisfies MeasurementSizeConfig;

export const compressionGarmentConfig = {
  fields: {
    chest: {
      defaultCm: 94,
      label: "Chest or bust circumference",
      maxCm: 210,
      minCm: 45,
      quantity: "length",
    },
    waist: {
      defaultCm: 78,
      label: "Waist circumference",
      maxCm: 200,
      minCm: 35,
      quantity: "length",
    },
    hip: {
      defaultCm: 100,
      label: "Hip circumference",
      maxCm: 220,
      minCm: 45,
      quantity: "length",
    },
  },
  intro:
    "Compare compression garment measurements in metric and US customary units.",
  kind: "compression-garment",
  mode: "body",
  name: "Compression Garment Size Guide",
} as const satisfies MeasurementSizeConfig;

export const jacketConfig = {
  fields: {
    chest: {
      defaultCm: 102,
      label: "Chest circumference",
      maxCm: 200,
      minCm: 50,
      quantity: "length",
    },
    waist: {
      defaultCm: 88,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 40,
      quantity: "length",
    },
    height: {
      defaultCm: 178,
      label: "Body height",
      maxCm: 230,
      minCm: 120,
      quantity: "length",
    },
  },
  intro: "Compare jacket measurements in metric and US customary units.",
  kind: "jacket",
  mode: "body",
  name: "Jacket Size Guide",
} as const satisfies MeasurementSizeConfig;

export const jeansConfig = {
  fields: {
    waist: {
      defaultCm: 84,
      label: "Waist circumference",
      maxCm: 180,
      minCm: 50,
      quantity: "length",
    },
    hip: {
      defaultCm: 100,
      label: "Hip circumference",
      maxCm: 210,
      minCm: 60,
      quantity: "length",
    },
    inseam: {
      defaultCm: 81,
      label: "Inside leg",
      maxCm: 130,
      minCm: 40,
      quantity: "length",
    },
  },
  intro: "Compare jeans measurements in metric and US customary units.",
  kind: "jeans",
  mode: "body",
  name: "Jeans Size Guide",
} as const satisfies MeasurementSizeConfig;

export const leggingsConfig = {
  fields: {
    waist: {
      defaultCm: 76,
      label: "Waist circumference",
      maxCm: 180,
      minCm: 40,
      quantity: "length",
    },
    hip: {
      defaultCm: 98,
      label: "Hip circumference",
      maxCm: 210,
      minCm: 50,
      quantity: "length",
    },
    inseam: {
      defaultCm: 72,
      label: "Inside leg or garment inseam",
      maxCm: 130,
      minCm: 5,
      quantity: "length",
    },
  },
  intro: "Compare leggings measurements in metric and US customary units.",
  kind: "leggings",
  mode: "body",
  name: "Leggings Size Guide",
} as const satisfies MeasurementSizeConfig;

export const maternityClothingConfig = {
  fields: {
    bust: {
      defaultCm: 96,
      label: "Bust circumference",
      maxCm: 210,
      minCm: 50,
      quantity: "length",
    },
    underbust: {
      defaultCm: 82,
      label: "Underbust circumference",
      maxCm: 190,
      minCm: 45,
      quantity: "length",
    },
    hip: {
      defaultCm: 104,
      label: "Hip circumference",
      maxCm: 230,
      minCm: 55,
      quantity: "length",
    },
  },
  intro:
    "Compare maternity clothing measurements in metric and US customary units.",
  kind: "maternity-clothing",
  mode: "body",
  name: "Maternity Clothing Size Guide",
} as const satisfies MeasurementSizeConfig;

export const overallsConfig = {
  fields: {
    chest: {
      defaultCm: 100,
      label: "Chest circumference",
      maxCm: 210,
      minCm: 50,
      quantity: "length",
    },
    waist: {
      defaultCm: 88,
      label: "Waist circumference",
      maxCm: 200,
      minCm: 40,
      quantity: "length",
    },
    inseam: {
      defaultCm: 81,
      label: "Inside leg",
      maxCm: 130,
      minCm: 40,
      quantity: "length",
    },
  },
  intro: "Compare overalls measurements in metric and US customary units.",
  kind: "overalls",
  mode: "body",
  name: "Overalls Size Guide",
} as const satisfies MeasurementSizeConfig;

export const shortsConfig = {
  fields: {
    waist: {
      defaultCm: 76,
      label: "Waist circumference",
      maxCm: 180,
      minCm: 40,
      quantity: "length",
    },
    hip: {
      defaultCm: 98,
      label: "Hip circumference",
      maxCm: 210,
      minCm: 50,
      quantity: "length",
    },
    inseam: {
      defaultCm: 72,
      label: "Inside leg or garment inseam",
      maxCm: 130,
      minCm: 5,
      quantity: "length",
    },
  },
  intro: "Compare shorts measurements in metric and US customary units.",
  kind: "shorts",
  mode: "body",
  name: "Shorts Size Guide",
} as const satisfies MeasurementSizeConfig;

export const skirtConfig = {
  fields: {
    waist: {
      defaultCm: 76,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 40,
      quantity: "length",
    },
    hip: {
      defaultCm: 100,
      label: "Hip circumference",
      maxCm: 220,
      minCm: 50,
      quantity: "length",
    },
    length: {
      defaultCm: 65,
      label: "Desired skirt length",
      maxCm: 160,
      minCm: 20,
      quantity: "length",
    },
  },
  intro: "Compare skirt measurements in metric and US customary units.",
  kind: "skirt",
  mode: "body",
  name: "Skirt Size Guide",
} as const satisfies MeasurementSizeConfig;

export const swimwearConfig = {
  fields: {
    chest: {
      defaultCm: 94,
      label: "Chest or bust circumference",
      maxCm: 210,
      minCm: 45,
      quantity: "length",
    },
    waist: {
      defaultCm: 78,
      label: "Waist circumference",
      maxCm: 200,
      minCm: 35,
      quantity: "length",
    },
    hip: {
      defaultCm: 100,
      label: "Hip circumference",
      maxCm: 220,
      minCm: 45,
      quantity: "length",
    },
  },
  intro: "Compare swimwear measurements in metric and US customary units.",
  kind: "swimwear",
  mode: "body",
  name: "Swimwear Size Guide",
} as const satisfies MeasurementSizeConfig;

export const underwearConfig = {
  fields: {
    waist: {
      defaultCm: 78,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 40,
      quantity: "length",
    },
    hip: {
      defaultCm: 100,
      label: "Hip circumference",
      maxCm: 220,
      minCm: 50,
      quantity: "length",
    },
  },
  intro: "Compare underwear measurements in metric and US customary units.",
  kind: "underwear",
  mode: "body",
  name: "Underwear Size Guide",
} as const satisfies MeasurementSizeConfig;

export const wetsuitConfig = {
  fields: {
    height: {
      defaultCm: 178,
      label: "Body height",
      maxCm: 230,
      minCm: 120,
      quantity: "length",
    },
    chest: {
      defaultCm: 100,
      label: "Chest circumference",
      maxCm: 210,
      minCm: 50,
      quantity: "length",
    },
    waist: {
      defaultCm: 86,
      label: "Waist circumference",
      maxCm: 200,
      minCm: 40,
      quantity: "length",
    },
    hip: {
      defaultCm: 100,
      label: "Hip circumference",
      maxCm: 220,
      minCm: 50,
      quantity: "length",
    },
  },
  intro: "Compare wetsuit measurements in metric and US customary units.",
  kind: "wetsuit",
  mode: "body",
  name: "Wetsuit Size Guide",
} as const satisfies MeasurementSizeConfig;

export const ankletConfig = {
  fields: {
    ankle: {
      defaultCm: 22,
      label: "Ankle circumference",
      maxCm: 50,
      minCm: 10,
      quantity: "length",
    },
    ease: {
      defaultCm: 1.5,
      label: "Preferred ease",
      maxCm: 10,
      minCm: 0,
      quantity: "length",
    },
  },
  intro: "Compare anklet measurements in metric and US customary units.",
  kind: "anklet",
  mode: "dimensions",
  name: "Anklet Size Guide",
} as const satisfies MeasurementSizeConfig;

export const bangleConfig = {
  fields: {
    hand: {
      defaultCm: 21,
      label: "Hand circumference over knuckles",
      maxCm: 40,
      minCm: 10,
      quantity: "length",
    },
  },
  intro: "Compare bangle measurements in metric and US customary units.",
  kind: "bangle",
  mode: "dimensions",
  name: "Bangle Size Guide",
} as const satisfies MeasurementSizeConfig;

export const bowTieConfig = {
  fields: {
    neck: {
      defaultCm: 39,
      label: "Neck circumference",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
  },
  intro: "Compare bow tie measurements in metric and US customary units.",
  kind: "bow-tie",
  mode: "dimensions",
  name: "Bow Tie Size Guide",
} as const satisfies MeasurementSizeConfig;

export const braceletConfig = {
  fields: {
    wrist: {
      defaultCm: 17,
      label: "Wrist circumference",
      maxCm: 35,
      minCm: 8,
      quantity: "length",
    },
    ease: {
      defaultCm: 1,
      label: "Preferred ease",
      maxCm: 10,
      minCm: 0,
      quantity: "length",
    },
  },
  intro: "Compare bracelet measurements in metric and US customary units.",
  kind: "bracelet",
  mode: "dimensions",
  name: "Bracelet Size Guide",
} as const satisfies MeasurementSizeConfig;

export const capConfig = {
  fields: {
    head: {
      defaultCm: 57,
      label: "Head circumference",
      maxCm: 80,
      minCm: 30,
      quantity: "length",
    },
  },
  intro: "Compare cap measurements in metric and US customary units.",
  kind: "cap",
  mode: "dimensions",
  name: "Cap Size Guide",
} as const satisfies MeasurementSizeConfig;

export const chokerConfig = {
  fields: {
    neck: {
      defaultCm: 34,
      label: "Neck circumference",
      maxCm: 70,
      minCm: 20,
      quantity: "length",
    },
    ease: {
      defaultCm: 2,
      label: "Preferred ease",
      maxCm: 12,
      minCm: 0,
      quantity: "length",
    },
  },
  intro: "Compare choker measurements in metric and US customary units.",
  kind: "choker",
  mode: "dimensions",
  name: "Choker Size Guide",
} as const satisfies MeasurementSizeConfig;

export const glassesConfig = {
  fields: {
    lensWidth: {
      defaultCm: 5.2,
      label: "Lens width",
      maxCm: 9,
      minCm: 2,
      quantity: "length",
    },
    bridgeWidth: {
      defaultCm: 1.8,
      label: "Bridge width",
      maxCm: 4,
      minCm: 0.8,
      quantity: "length",
    },
    templeLength: {
      defaultCm: 14,
      label: "Temple length",
      maxCm: 20,
      minCm: 8,
      quantity: "length",
    },
  },
  intro: "Compare glasses measurements in metric and US customary units.",
  kind: "glasses",
  mode: "dimensions",
  name: "Glasses Size Guide",
} as const satisfies MeasurementSizeConfig;

export const hatConfig = {
  fields: {
    head: {
      defaultCm: 57,
      label: "Head circumference",
      maxCm: 80,
      minCm: 30,
      quantity: "length",
    },
  },
  intro: "Compare hat measurements in metric and US customary units.",
  kind: "hat",
  mode: "dimensions",
  name: "Hat Size Guide",
} as const satisfies MeasurementSizeConfig;

export const headphonesConfig = {
  fields: {
    headWidth: {
      defaultCm: 15,
      label: "Head width",
      maxCm: 25,
      minCm: 8,
      quantity: "length",
    },
    headArc: {
      defaultCm: 32,
      label: "Over-head arc",
      maxCm: 55,
      minCm: 15,
      quantity: "length",
    },
  },
  intro: "Compare headphones measurements in metric and US customary units.",
  kind: "headphones",
  mode: "dimensions",
  name: "Headphones Size Guide",
} as const satisfies MeasurementSizeConfig;

export const helmetConfig = {
  fields: {
    head: {
      defaultCm: 57,
      label: "Head circumference",
      maxCm: 80,
      minCm: 30,
      quantity: "length",
    },
  },
  intro: "Compare helmet measurements in metric and US customary units.",
  kind: "helmet",
  mode: "dimensions",
  name: "Helmet Size Guide",
} as const satisfies MeasurementSizeConfig;

export const necklaceConfig = {
  fields: {
    neck: {
      defaultCm: 36,
      label: "Neck circumference",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
    desiredDrop: {
      defaultCm: 10,
      label: "Desired drop",
      maxCm: 80,
      minCm: 0,
      quantity: "length",
    },
  },
  intro: "Compare necklace measurements in metric and US customary units.",
  kind: "necklace",
  mode: "dimensions",
  name: "Necklace Size Guide",
} as const satisfies MeasurementSizeConfig;

export const smartwatchConfig = {
  fields: {
    wrist: {
      defaultCm: 17,
      label: "Wrist circumference",
      maxCm: 35,
      minCm: 8,
      quantity: "length",
    },
    ease: {
      defaultCm: 1,
      label: "Preferred ease",
      maxCm: 10,
      minCm: 0,
      quantity: "length",
    },
  },
  intro: "Compare smartwatch measurements in metric and US customary units.",
  kind: "smartwatch",
  mode: "dimensions",
  name: "Smartwatch Size Guide",
} as const satisfies MeasurementSizeConfig;

export const sunglassesConfig = {
  fields: {
    lensWidth: {
      defaultCm: 5.2,
      label: "Lens width",
      maxCm: 9,
      minCm: 2,
      quantity: "length",
    },
    bridgeWidth: {
      defaultCm: 1.8,
      label: "Bridge width",
      maxCm: 4,
      minCm: 0.8,
      quantity: "length",
    },
    templeLength: {
      defaultCm: 14,
      label: "Temple length",
      maxCm: 20,
      minCm: 8,
      quantity: "length",
    },
  },
  intro: "Compare sunglasses measurements in metric and US customary units.",
  kind: "sunglasses",
  mode: "dimensions",
  name: "Sunglasses Size Guide",
} as const satisfies MeasurementSizeConfig;

export const tieConfig = {
  fields: {
    neck: {
      defaultCm: 40,
      label: "Neck circumference",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
    desiredLength: {
      defaultCm: 147,
      label: "Finished tie length",
      maxCm: 190,
      minCm: 80,
      quantity: "length",
    },
  },
  intro: "Compare tie measurements in metric and US customary units.",
  kind: "tie",
  mode: "dimensions",
  name: "Tie Size Guide",
} as const satisfies MeasurementSizeConfig;

export const watchCaseConfig = {
  fields: {
    wrist: {
      defaultCm: 17,
      label: "Wrist circumference",
      maxCm: 35,
      minCm: 8,
      quantity: "length",
    },
    caseDiameter: {
      defaultCm: 4,
      label: "Preferred case diameter",
      maxCm: 7,
      minCm: 2,
      quantity: "length",
    },
  },
  intro: "Compare watch case measurements in metric and US customary units.",
  kind: "watch-case",
  mode: "dimensions",
  name: "Watch Case Size Guide",
} as const satisfies MeasurementSizeConfig;

export const blanketConfig = {
  fields: {
    width: {
      defaultCm: 200,
      label: "Finished width",
      maxCm: 400,
      minCm: 40,
      quantity: "length",
    },
    length: {
      defaultCm: 220,
      label: "Finished length",
      maxCm: 500,
      minCm: 40,
      quantity: "length",
    },
  },
  intro: "Compare blanket measurements in metric and US customary units.",
  kind: "blanket",
  mode: "dimensions",
  name: "Blanket Size Reference",
} as const satisfies MeasurementSizeConfig;

export const curtainConfig = {
  fields: {
    panelWidth: {
      defaultCm: 140,
      label: "Panel width",
      maxCm: 1000,
      minCm: 20,
      quantity: "length",
    },
    drop: {
      defaultCm: 240,
      label: "Curtain drop",
      maxCm: 1000,
      minCm: 20,
      quantity: "length",
    },
  },
  intro: "Compare curtain measurements in metric and US customary units.",
  kind: "curtain",
  mode: "dimensions",
  name: "Curtain Size Reference",
} as const satisfies MeasurementSizeConfig;

export const duvetCoverConfig = {
  fields: {
    width: {
      defaultCm: 200,
      label: "Finished width",
      maxCm: 400,
      minCm: 40,
      quantity: "length",
    },
    length: {
      defaultCm: 220,
      label: "Finished length",
      maxCm: 500,
      minCm: 40,
      quantity: "length",
    },
  },
  intro: "Compare duvet cover measurements in metric and US customary units.",
  kind: "duvet-cover",
  mode: "dimensions",
  name: "Duvet Cover Size Reference",
} as const satisfies MeasurementSizeConfig;

export const duvetConfig = {
  fields: {
    width: {
      defaultCm: 200,
      label: "Finished width",
      maxCm: 400,
      minCm: 40,
      quantity: "length",
    },
    length: {
      defaultCm: 220,
      label: "Finished length",
      maxCm: 500,
      minCm: 40,
      quantity: "length",
    },
  },
  intro: "Compare duvet measurements in metric and US customary units.",
  kind: "duvet",
  mode: "dimensions",
  name: "Duvet Size Reference",
} as const satisfies MeasurementSizeConfig;

export const fittedSheetConfig = {
  fields: {
    width: {
      defaultCm: 152,
      label: "Mattress width",
      maxCm: 300,
      minCm: 40,
      quantity: "length",
    },
    length: {
      defaultCm: 203,
      label: "Mattress length",
      maxCm: 300,
      minCm: 80,
      quantity: "length",
    },
    depth: {
      defaultCm: 30,
      label: "Mattress depth",
      maxCm: 80,
      minCm: 2,
      quantity: "length",
    },
  },
  intro: "Compare fitted sheet measurements in metric and US customary units.",
  kind: "fitted-sheet",
  mode: "dimensions",
  name: "Fitted Sheet Size Reference",
} as const satisfies MeasurementSizeConfig;

export const flatSheetConfig = {
  fields: {
    width: {
      defaultCm: 200,
      label: "Finished width",
      maxCm: 400,
      minCm: 40,
      quantity: "length",
    },
    length: {
      defaultCm: 220,
      label: "Finished length",
      maxCm: 500,
      minCm: 40,
      quantity: "length",
    },
  },
  intro: "Compare flat sheet measurements in metric and US customary units.",
  kind: "flat-sheet",
  mode: "dimensions",
  name: "Flat Sheet Size Reference",
} as const satisfies MeasurementSizeConfig;

export const mattressConfig = {
  fields: {
    width: {
      defaultCm: 152,
      label: "Mattress width",
      maxCm: 300,
      minCm: 40,
      quantity: "length",
    },
    length: {
      defaultCm: 203,
      label: "Mattress length",
      maxCm: 300,
      minCm: 80,
      quantity: "length",
    },
    depth: {
      defaultCm: 30,
      label: "Mattress depth",
      maxCm: 80,
      minCm: 2,
      quantity: "length",
    },
  },
  intro: "Compare mattress measurements in metric and US customary units.",
  kind: "mattress",
  mode: "dimensions",
  name: "Mattress Size Reference",
} as const satisfies MeasurementSizeConfig;

export const pillowConfig = {
  fields: {
    width: {
      defaultCm: 50,
      label: "Pillow width",
      maxCm: 150,
      minCm: 10,
      quantity: "length",
    },
    length: {
      defaultCm: 75,
      label: "Pillow length",
      maxCm: 250,
      minCm: 10,
      quantity: "length",
    },
  },
  intro: "Compare pillow measurements in metric and US customary units.",
  kind: "pillow",
  mode: "dimensions",
  name: "Pillow Size Reference",
} as const satisfies MeasurementSizeConfig;

export const pillowcaseConfig = {
  fields: {
    width: {
      defaultCm: 50,
      label: "Pillow width",
      maxCm: 150,
      minCm: 10,
      quantity: "length",
    },
    length: {
      defaultCm: 75,
      label: "Pillow length",
      maxCm: 250,
      minCm: 10,
      quantity: "length",
    },
  },
  intro: "Compare pillowcase measurements in metric and US customary units.",
  kind: "pillowcase",
  mode: "dimensions",
  name: "Pillowcase Size Reference",
} as const satisfies MeasurementSizeConfig;

export const rugConfig = {
  fields: {
    width: {
      defaultCm: 160,
      label: "Rug width",
      maxCm: 1500,
      minCm: 20,
      quantity: "length",
    },
    length: {
      defaultCm: 230,
      label: "Rug length",
      maxCm: 3000,
      minCm: 20,
      quantity: "length",
    },
  },
  intro: "Compare rug measurements in metric and US customary units.",
  kind: "rug",
  mode: "dimensions",
  name: "Rug Size Reference",
} as const satisfies MeasurementSizeConfig;

export const tableclothConfig = {
  fields: {
    tableWidth: {
      defaultCm: 100,
      label: "Table width",
      maxCm: 500,
      minCm: 20,
      quantity: "length",
    },
    tableLength: {
      defaultCm: 180,
      label: "Table length",
      maxCm: 1000,
      minCm: 20,
      quantity: "length",
    },
    desiredDrop: {
      defaultCm: 25,
      label: "Desired drop per side",
      maxCm: 100,
      minCm: 5,
      quantity: "length",
    },
  },
  intro: "Compare tablecloth measurements in metric and US customary units.",
  kind: "tablecloth",
  mode: "dimensions",
  name: "Tablecloth Size Reference",
} as const satisfies MeasurementSizeConfig;

export const bookFormatConfig = {
  fields: {
    width: {
      defaultCm: 21,
      label: "Width",
      maxCm: 300,
      minCm: 0.5,
      quantity: "length",
    },
    height: {
      defaultCm: 29.7,
      label: "Height",
      maxCm: 500,
      minCm: 0.5,
      quantity: "length",
    },
  },
  intro: "Compare book format measurements in metric and US customary units.",
  kind: "book-format",
  mode: "dimensions",
  name: "Book Format Size Reference",
} as const satisfies MeasurementSizeConfig;

export const envelopeConfig = {
  fields: {
    width: {
      defaultCm: 21,
      label: "Width",
      maxCm: 300,
      minCm: 0.5,
      quantity: "length",
    },
    height: {
      defaultCm: 29.7,
      label: "Height",
      maxCm: 500,
      minCm: 0.5,
      quantity: "length",
    },
  },
  intro: "Compare envelope measurements in metric and US customary units.",
  kind: "envelope",
  mode: "dimensions",
  name: "Envelope Size Reference",
} as const satisfies MeasurementSizeConfig;

export const paperConfig = {
  fields: {
    width: {
      defaultCm: 21,
      label: "Width",
      maxCm: 300,
      minCm: 0.5,
      quantity: "length",
    },
    height: {
      defaultCm: 29.7,
      label: "Height",
      maxCm: 500,
      minCm: 0.5,
      quantity: "length",
    },
  },
  intro: "Compare paper measurements in metric and US customary units.",
  kind: "paper",
  mode: "dimensions",
  name: "Paper Size Reference",
} as const satisfies MeasurementSizeConfig;

export const photographConfig = {
  fields: {
    width: {
      defaultCm: 21,
      label: "Width",
      maxCm: 300,
      minCm: 0.5,
      quantity: "length",
    },
    height: {
      defaultCm: 29.7,
      label: "Height",
      maxCm: 500,
      minCm: 0.5,
      quantity: "length",
    },
  },
  intro: "Compare photograph measurements in metric and US customary units.",
  kind: "photograph",
  mode: "dimensions",
  name: "Photograph Size Reference",
} as const satisfies MeasurementSizeConfig;

export const pictureFrameConfig = {
  fields: {
    width: {
      defaultCm: 21,
      label: "Width",
      maxCm: 300,
      minCm: 0.5,
      quantity: "length",
    },
    height: {
      defaultCm: 29.7,
      label: "Height",
      maxCm: 500,
      minCm: 0.5,
      quantity: "length",
    },
  },
  intro: "Compare picture frame measurements in metric and US customary units.",
  kind: "picture-frame",
  mode: "dimensions",
  name: "Picture Frame Size Reference",
} as const satisfies MeasurementSizeConfig;

export const batteryConfig = {
  fields: {
    diameter: {
      defaultCm: 1.45,
      label: "Cell diameter or width",
      maxCm: 30,
      minCm: 0.1,
      quantity: "length",
    },
    length: {
      defaultCm: 5.05,
      label: "Cell length or height",
      maxCm: 60,
      minCm: 0.1,
      quantity: "length",
    },
  },
  intro: "Compare battery measurements in metric and US customary units.",
  kind: "battery",
  mode: "dimensions",
  name: "Battery Size Reference",
} as const satisfies MeasurementSizeConfig;

export const drillBitConfig = {
  fields: {
    diameter: {
      defaultCm: 0.8,
      label: "Bit diameter",
      maxCm: 15,
      minCm: 0.01,
      quantity: "length",
    },
  },
  intro: "Compare drill bit measurements in metric and US customary units.",
  kind: "drill-bit",
  mode: "dimensions",
  name: "Drill Bit Size Reference",
} as const satisfies MeasurementSizeConfig;

export const electricalConnectorConfig = {
  fields: {
    width: {
      defaultCm: 1.2,
      label: "Connector width",
      maxCm: 50,
      minCm: 0.05,
      quantity: "length",
    },
    height: {
      defaultCm: 0.5,
      label: "Connector height",
      maxCm: 30,
      minCm: 0.05,
      quantity: "length",
    },
    pitch: {
      defaultCm: 0.254,
      label: "Contact pitch",
      maxCm: 2.5,
      minCm: 0.02,
      quantity: "length",
    },
  },
  intro:
    "Compare electrical connector measurements in metric and US customary units.",
  kind: "electrical-connector",
  mode: "dimensions",
  name: "Electrical Connector Size Reference",
} as const satisfies MeasurementSizeConfig;

export const lumberConfig = {
  fields: {
    thickness: {
      defaultCm: 5,
      label: "Nominal thickness",
      maxCm: 100,
      minCm: 0.5,
      quantity: "length",
    },
    width: {
      defaultCm: 10,
      label: "Nominal width",
      maxCm: 200,
      minCm: 0.5,
      quantity: "length",
    },
    length: {
      defaultCm: 240,
      label: "Board length",
      maxCm: 2000,
      minCm: 10,
      quantity: "length",
    },
  },
  intro: "Compare lumber measurements in metric and US customary units.",
  kind: "lumber",
  mode: "dimensions",
  name: "Lumber Size Reference",
} as const satisfies MeasurementSizeConfig;

export const nutConfig = {
  fields: {
    threadDiameter: {
      defaultCm: 0.8,
      label: "Nominal thread diameter",
      maxCm: 20,
      minCm: 0.1,
      quantity: "length",
    },
    acrossFlats: {
      defaultCm: 1.3,
      label: "Width across flats",
      maxCm: 30,
      minCm: 0.1,
      quantity: "length",
    },
  },
  intro: "Compare nut measurements in metric and US customary units.",
  kind: "nut",
  mode: "dimensions",
  name: "Nut Size Reference",
} as const satisfies MeasurementSizeConfig;

export const pipeConfig = {
  fields: {
    outsideDiameter: {
      defaultCm: 2.69,
      label: "Outside diameter",
      maxCm: 300,
      minCm: 0.1,
      quantity: "length",
    },
    wallThickness: {
      defaultCm: 0.28,
      label: "Wall thickness",
      maxCm: 30,
      minCm: 0.01,
      quantity: "length",
    },
  },
  intro: "Compare pipe measurements in metric and US customary units.",
  kind: "pipe",
  mode: "dimensions",
  name: "Pipe Size Reference",
} as const satisfies MeasurementSizeConfig;

export const screwConfig = {
  fields: {
    diameter: {
      defaultCm: 0.6,
      label: "Nominal diameter",
      maxCm: 20,
      minCm: 0.05,
      quantity: "length",
    },
    length: {
      defaultCm: 4,
      label: "Screw length",
      maxCm: 300,
      minCm: 0.1,
      quantity: "length",
    },
  },
  intro: "Compare screw measurements in metric and US customary units.",
  kind: "screw",
  mode: "dimensions",
  name: "Screw Size Reference",
} as const satisfies MeasurementSizeConfig;

export const tireWheelConfig = {
  fields: {
    treadWidth: {
      defaultCm: 22.5,
      label: "Tire section width",
      maxCm: 100,
      minCm: 5,
      quantity: "length",
    },
    sidewallHeight: {
      defaultCm: 12.4,
      label: "Sidewall height",
      maxCm: 60,
      minCm: 2,
      quantity: "length",
    },
    rimDiameter: {
      defaultCm: 43.2,
      label: "Rim diameter",
      maxCm: 100,
      minCm: 10,
      quantity: "length",
    },
  },
  intro: "Compare tire wheel measurements in metric and US customary units.",
  kind: "tire-wheel",
  mode: "dimensions",
  name: "Tire Wheel Size Reference",
} as const satisfies MeasurementSizeConfig;

export const wireGaugeConfig = {
  fields: {
    diameter: {
      defaultCm: 0.205,
      label: "Conductor diameter",
      maxCm: 5,
      minCm: 0.005,
      quantity: "length",
    },
  },
  intro: "Compare wire gauge measurements in metric and US customary units.",
  kind: "wire-gauge",
  mode: "dimensions",
  name: "Wire Gauge Size Reference",
} as const satisfies MeasurementSizeConfig;

export const bootConfig = {
  fields: {
    footLength: {
      defaultCm: 27,
      label: "Foot length",
      maxCm: 40,
      minCm: 8,
      quantity: "length",
    },
    footWidth: {
      defaultCm: 10,
      label: "Foot width",
      maxCm: 18,
      minCm: 4,
      quantity: "length",
    },
  },
  intro: "Compare boot measurements in metric and US customary units.",
  kind: "boot",
  mode: "equipment",
  name: "Boot Size Guide",
} as const satisfies MeasurementSizeConfig;

export const climbingShoeConfig = {
  fields: {
    footLength: {
      defaultCm: 27,
      label: "Foot length",
      maxCm: 40,
      minCm: 8,
      quantity: "length",
    },
    footWidth: {
      defaultCm: 10,
      label: "Foot width",
      maxCm: 18,
      minCm: 4,
      quantity: "length",
    },
  },
  intro: "Compare climbing shoe measurements in metric and US customary units.",
  kind: "climbing-shoe",
  mode: "equipment",
  name: "Climbing Shoe Size Guide",
} as const satisfies MeasurementSizeConfig;

export const hikingBootConfig = {
  fields: {
    footLength: {
      defaultCm: 27,
      label: "Foot length",
      maxCm: 40,
      minCm: 8,
      quantity: "length",
    },
    footWidth: {
      defaultCm: 10,
      label: "Foot width",
      maxCm: 18,
      minCm: 4,
      quantity: "length",
    },
  },
  intro: "Compare hiking boot measurements in metric and US customary units.",
  kind: "hiking-boot",
  mode: "equipment",
  name: "Hiking Boot Size Guide",
} as const satisfies MeasurementSizeConfig;

export const iceSkateConfig = {
  fields: {
    footLength: {
      defaultCm: 27,
      label: "Foot length",
      maxCm: 40,
      minCm: 8,
      quantity: "length",
    },
    footWidth: {
      defaultCm: 10,
      label: "Foot width",
      maxCm: 18,
      minCm: 4,
      quantity: "length",
    },
  },
  intro: "Compare ice skate measurements in metric and US customary units.",
  kind: "ice-skate",
  mode: "equipment",
  name: "Ice Skate Size Guide",
} as const satisfies MeasurementSizeConfig;

export const rollerSkateConfig = {
  fields: {
    footLength: {
      defaultCm: 27,
      label: "Foot length",
      maxCm: 40,
      minCm: 8,
      quantity: "length",
    },
    footWidth: {
      defaultCm: 10,
      label: "Foot width",
      maxCm: 18,
      minCm: 4,
      quantity: "length",
    },
  },
  intro: "Compare roller skate measurements in metric and US customary units.",
  kind: "roller-skate",
  mode: "equipment",
  name: "Roller Skate Size Guide",
} as const satisfies MeasurementSizeConfig;

export const skiBootConfig = {
  fields: {
    footLength: {
      defaultCm: 27,
      label: "Foot length",
      maxCm: 40,
      minCm: 8,
      quantity: "length",
    },
    footWidth: {
      defaultCm: 10,
      label: "Foot width",
      maxCm: 18,
      minCm: 4,
      quantity: "length",
    },
  },
  intro: "Compare ski boot measurements in metric and US customary units.",
  kind: "ski-boot",
  mode: "equipment",
  name: "Ski Boot Size Guide",
} as const satisfies MeasurementSizeConfig;

export const snowshoeConfig = {
  fields: {
    bootLength: {
      defaultCm: 31,
      label: "Boot outsole length",
      maxCm: 50,
      minCm: 15,
      quantity: "length",
    },
    bodyWeight: {
      defaultCm: 85,
      label: "Body weight including gear",
      maxCm: 250,
      minCm: 15,
      quantity: "mass",
    },
  },
  intro: "Compare snowshoe measurements in metric and US customary units.",
  kind: "snowshoe",
  mode: "equipment",
  name: "Snowshoe Size Guide",
} as const satisfies MeasurementSizeConfig;

export const backpackConfig = {
  fields: {
    torsoLength: {
      defaultCm: 48,
      label: "Torso length",
      maxCm: 80,
      minCm: 25,
      quantity: "length",
    },
    hip: {
      defaultCm: 95,
      label: "Hip circumference",
      maxCm: 180,
      minCm: 50,
      quantity: "length",
    },
  },
  intro: "Compare backpack measurements in metric and US customary units.",
  kind: "backpack",
  mode: "equipment",
  name: "Backpack Size Guide",
} as const satisfies MeasurementSizeConfig;

export const bicycleFrameConfig = {
  fields: {
    inseam: {
      defaultCm: 82,
      label: "Cycling inseam",
      maxCm: 120,
      minCm: 40,
      quantity: "length",
    },
    height: {
      defaultCm: 178,
      label: "Body height",
      maxCm: 230,
      minCm: 100,
      quantity: "length",
    },
  },
  intro: "Compare bicycle frame measurements in metric and US customary units.",
  kind: "bicycle-frame",
  mode: "equipment",
  name: "Bicycle Frame Size Guide",
} as const satisfies MeasurementSizeConfig;

export const climbingHarnessConfig = {
  fields: {
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      maxCm: 180,
      minCm: 40,
      quantity: "length",
    },
    thigh: {
      defaultCm: 58,
      label: "Thigh circumference",
      maxCm: 100,
      minCm: 25,
      quantity: "length",
    },
  },
  intro:
    "Compare climbing harness measurements in metric and US customary units.",
  kind: "climbing-harness",
  mode: "equipment",
  name: "Climbing Harness Size Guide",
} as const satisfies MeasurementSizeConfig;

export const golfClubConfig = {
  fields: {
    height: {
      defaultCm: 178,
      label: "Body height",
      maxCm: 230,
      minCm: 100,
      quantity: "length",
    },
    wristToFloor: {
      defaultCm: 86,
      label: "Wrist-to-floor distance",
      maxCm: 130,
      minCm: 45,
      quantity: "length",
    },
  },
  intro: "Compare golf club measurements in metric and US customary units.",
  kind: "golf-club",
  mode: "equipment",
  name: "Golf Club Size Guide",
} as const satisfies MeasurementSizeConfig;

export const lifeJacketConfig = {
  fields: {
    chest: {
      defaultCm: 100,
      label: "Chest circumference",
      maxCm: 200,
      minCm: 40,
      quantity: "length",
    },
    bodyWeight: {
      defaultCm: 80,
      label: "Body weight",
      maxCm: 250,
      minCm: 10,
      quantity: "mass",
    },
  },
  intro: "Compare life jacket measurements in metric and US customary units.",
  kind: "life-jacket",
  mode: "equipment",
  name: "Life Jacket Size Guide",
} as const satisfies MeasurementSizeConfig;

export const luggageConfig = {
  fields: {
    height: {
      defaultCm: 55,
      label: "Case height",
      maxCm: 200,
      minCm: 10,
      quantity: "length",
    },
    width: {
      defaultCm: 40,
      label: "Case width",
      maxCm: 150,
      minCm: 10,
      quantity: "length",
    },
    depth: {
      defaultCm: 23,
      label: "Case depth",
      maxCm: 100,
      minCm: 5,
      quantity: "length",
    },
  },
  intro: "Compare luggage measurements in metric and US customary units.",
  kind: "luggage",
  mode: "dimensions",
  name: "Luggage Size Guide",
} as const satisfies MeasurementSizeConfig;

export const racketGripConfig = {
  fields: {
    handLength: {
      defaultCm: 11,
      label: "Palm crease to ring-finger tip",
      maxCm: 25,
      minCm: 5,
      quantity: "length",
    },
  },
  intro: "Compare racket grip measurements in metric and US customary units.",
  kind: "racket-grip",
  mode: "equipment",
  name: "Racket Grip Size Guide",
} as const satisfies MeasurementSizeConfig;

export const skiConfig = {
  fields: {
    height: {
      defaultCm: 178,
      label: "Body height",
      maxCm: 230,
      minCm: 100,
      quantity: "length",
    },
    bodyWeight: {
      defaultCm: 80,
      label: "Body weight",
      maxCm: 250,
      minCm: 20,
      quantity: "mass",
    },
  },
  intro: "Compare ski measurements in metric and US customary units.",
  kind: "ski",
  mode: "equipment",
  name: "Ski Size Guide",
} as const satisfies MeasurementSizeConfig;

export const snowboardConfig = {
  fields: {
    height: {
      defaultCm: 178,
      label: "Body height",
      maxCm: 230,
      minCm: 100,
      quantity: "length",
    },
    bodyWeight: {
      defaultCm: 80,
      label: "Body weight",
      maxCm: 250,
      minCm: 20,
      quantity: "mass",
    },
  },
  intro: "Compare snowboard measurements in metric and US customary units.",
  kind: "snowboard",
  mode: "equipment",
  name: "Snowboard Size Guide",
} as const satisfies MeasurementSizeConfig;

export const surfboardConfig = {
  fields: {
    height: {
      defaultCm: 178,
      label: "Body height",
      maxCm: 230,
      minCm: 100,
      quantity: "length",
    },
    bodyWeight: {
      defaultCm: 80,
      label: "Body weight",
      maxCm: 250,
      minCm: 20,
      quantity: "mass",
    },
  },
  intro: "Compare surfboard measurements in metric and US customary units.",
  kind: "surfboard",
  mode: "equipment",
  name: "Surfboard Size Guide",
} as const satisfies MeasurementSizeConfig;

export const childCarSeatConfig = {
  fields: {
    childHeight: {
      defaultCm: 105,
      label: "Child height",
      maxCm: 170,
      minCm: 40,
      quantity: "length",
    },
    childWeight: {
      defaultCm: 18,
      label: "Child weight",
      maxCm: 80,
      minCm: 2,
      quantity: "mass",
    },
  },
  intro:
    "Compare child car seat measurements in metric and US customary units.",
  kind: "child-car-seat",
  mode: "equipment",
  name: "Child Car Seat Size Guide",
} as const satisfies MeasurementSizeConfig;

export const protectivePadConfig = {
  fields: {
    joint: {
      defaultCm: 36,
      label: "Joint circumference",
      maxCm: 100,
      minCm: 10,
      quantity: "length",
    },
  },
  intro:
    "Compare protective pad measurements in metric and US customary units.",
  kind: "protective-pad",
  mode: "equipment",
  name: "Protective Pad Size Guide",
} as const satisfies MeasurementSizeConfig;

export const dogCoatConfig = {
  fields: {
    chest: {
      defaultCm: 55,
      label: "Chest girth",
      maxCm: 140,
      minCm: 20,
      quantity: "length",
    },
    neck: {
      defaultCm: 38,
      label: "Neck circumference",
      maxCm: 100,
      minCm: 10,
      quantity: "length",
    },
    back: {
      defaultCm: 45,
      label: "Back length",
      maxCm: 120,
      minCm: 10,
      quantity: "length",
    },
  },
  intro: "Compare dog coat measurements in metric and US customary units.",
  kind: "dog-coat",
  mode: "equipment",
  name: "Dog Coat Size Guide",
} as const satisfies MeasurementSizeConfig;

export const dogCollarConfig = {
  fields: {
    neck: {
      defaultCm: 38,
      label: "Neck circumference",
      maxCm: 100,
      minCm: 10,
      quantity: "length",
    },
    ease: {
      defaultCm: 3,
      label: "Fit allowance",
      maxCm: 15,
      minCm: 0,
      quantity: "length",
    },
  },
  intro: "Compare dog collar measurements in metric and US customary units.",
  kind: "dog-collar",
  mode: "equipment",
  name: "Dog Collar Size Guide",
} as const satisfies MeasurementSizeConfig;

export const dogHarnessConfig = {
  fields: {
    chest: {
      defaultCm: 55,
      label: "Chest girth",
      maxCm: 140,
      minCm: 20,
      quantity: "length",
    },
    neck: {
      defaultCm: 38,
      label: "Neck circumference",
      maxCm: 100,
      minCm: 10,
      quantity: "length",
    },
    back: {
      defaultCm: 45,
      label: "Back length",
      maxCm: 120,
      minCm: 10,
      quantity: "length",
    },
  },
  intro: "Compare dog harness measurements in metric and US customary units.",
  kind: "dog-harness",
  mode: "equipment",
  name: "Dog Harness Size Guide",
} as const satisfies MeasurementSizeConfig;

export const dogShoeConfig = {
  fields: {
    pawWidth: {
      defaultCm: 5.5,
      label: "Weight-bearing paw width",
      maxCm: 15,
      minCm: 1,
      quantity: "length",
    },
    pawLength: {
      defaultCm: 6,
      label: "Weight-bearing paw length",
      maxCm: 18,
      minCm: 1,
      quantity: "length",
    },
  },
  intro: "Compare dog shoe measurements in metric and US customary units.",
  kind: "dog-shoe",
  mode: "equipment",
  name: "Dog Shoe Size Guide",
} as const satisfies MeasurementSizeConfig;

export const horseBlanketConfig = {
  fields: {
    bodyLength: {
      defaultCm: 183,
      label: "Center chest to tail",
      maxCm: 260,
      minCm: 80,
      quantity: "length",
    },
  },
  intro: "Compare horse blanket measurements in metric and US customary units.",
  kind: "horse-blanket",
  mode: "equipment",
  name: "Horse Blanket Size Guide",
} as const satisfies MeasurementSizeConfig;

export const saddleConfig = {
  fields: {
    seat: {
      defaultCm: 43,
      label: "Seat length",
      maxCm: 65,
      minCm: 20,
      quantity: "length",
    },
    thigh: {
      defaultCm: 48,
      label: "Upper-leg length",
      maxCm: 80,
      minCm: 25,
      quantity: "length",
    },
  },
  intro: "Compare saddle measurements in metric and US customary units.",
  kind: "saddle",
  mode: "equipment",
  name: "Saddle Size Guide",
} as const satisfies MeasurementSizeConfig;

export const abayaReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 96,
      label: "Chest or bust circumference",
      minCm: 40,
      maxCm: 220,
    },
    height: {
      defaultCm: 175,
      label: "Body height",
      minCm: 80,
      maxCm: 240,
    },
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      minCm: 35,
      maxCm: 220,
    },
  },
  intro: "Create a made-to-measure starting profile for abaya reconstruction.",
  kind: "abaya-reconstruction",
  mode: "historical",
  name: "Abaya Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const bodiceReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 94,
      label: "Chest or bust circumference",
      maxCm: 210,
      minCm: 40,
      quantity: "length",
    },
    waist: {
      defaultCm: 76,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 35,
      quantity: "length",
    },
    backLength: {
      defaultCm: 42,
      label: "Back waist length",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for bodice reconstruction.",
  kind: "bodice-reconstruction",
  mode: "historical",
  name: "Bodice Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const breechesReconstructionConfig = {
  fields: {
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 35,
      quantity: "length",
    },
    hip: {
      defaultCm: 100,
      label: "Hip circumference",
      maxCm: 220,
      minCm: 45,
      quantity: "length",
    },
    garmentLength: {
      defaultCm: 85,
      label: "Desired garment length",
      maxCm: 160,
      minCm: 20,
      quantity: "length",
    },
  },
  intro:
    "Create a made-to-measure starting profile for breeches reconstruction.",
  kind: "breeches-reconstruction",
  mode: "historical",
  name: "Breeches Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const bustleReconstructionConfig = {
  fields: {
    waist: {
      defaultCm: 76,
      label: "Waist circumference",
      maxCm: 180,
      minCm: 35,
      quantity: "length",
    },
    waistToFloor: {
      defaultCm: 105,
      label: "Waist-to-floor length",
      maxCm: 150,
      minCm: 40,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for bustle reconstruction.",
  kind: "bustle-reconstruction",
  mode: "historical",
  name: "Bustle Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const chemiseReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 96,
      label: "Chest or bust circumference",
      minCm: 40,
      maxCm: 220,
    },
    height: {
      defaultCm: 175,
      label: "Body height",
      minCm: 80,
      maxCm: 240,
    },
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      minCm: 35,
      maxCm: 220,
    },
  },
  intro:
    "Create a made-to-measure starting profile for chemise reconstruction.",
  kind: "chemise-reconstruction",
  mode: "historical",
  name: "Chemise Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const chitonReconstructionConfig = {
  fields: {
    height: {
      defaultCm: 170,
      label: "Body height",
      maxCm: 230,
      minCm: 80,
      quantity: "length",
    },
    shoulder: {
      defaultCm: 42,
      label: "Shoulder width",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
    garmentLength: {
      defaultCm: 140,
      label: "Desired garment length",
      maxCm: 300,
      minCm: 40,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for chiton reconstruction.",
  kind: "chiton-reconstruction",
  mode: "historical",
  name: "Chiton Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const cloakReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 96,
      label: "Chest or bust circumference",
      minCm: 40,
      maxCm: 220,
    },
    height: {
      defaultCm: 175,
      label: "Body height",
      minCm: 80,
      maxCm: 240,
    },
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      minCm: 35,
      maxCm: 220,
    },
  },
  intro: "Create a made-to-measure starting profile for cloak reconstruction.",
  kind: "cloak-reconstruction",
  mode: "historical",
  name: "Cloak Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const corsetReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 94,
      label: "Chest or bust circumference",
      maxCm: 210,
      minCm: 40,
      quantity: "length",
    },
    waist: {
      defaultCm: 76,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 35,
      quantity: "length",
    },
    backLength: {
      defaultCm: 42,
      label: "Back waist length",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for corset reconstruction.",
  kind: "corset-reconstruction",
  mode: "historical",
  name: "Corset Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const crinolineReconstructionConfig = {
  fields: {
    waist: {
      defaultCm: 76,
      label: "Waist circumference",
      maxCm: 180,
      minCm: 35,
      quantity: "length",
    },
    waistToFloor: {
      defaultCm: 105,
      label: "Waist-to-floor length",
      maxCm: 150,
      minCm: 40,
      quantity: "length",
    },
  },
  intro:
    "Create a made-to-measure starting profile for crinoline reconstruction.",
  kind: "crinoline-reconstruction",
  mode: "historical",
  name: "Crinoline Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const dhotiReconstructionConfig = {
  fields: {
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 35,
      quantity: "length",
    },
    hip: {
      defaultCm: 100,
      label: "Hip circumference",
      maxCm: 220,
      minCm: 45,
      quantity: "length",
    },
    garmentLength: {
      defaultCm: 85,
      label: "Desired garment length",
      maxCm: 160,
      minCm: 20,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for dhoti reconstruction.",
  kind: "dhoti-reconstruction",
  mode: "historical",
  name: "Dhoti Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const doubletReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 94,
      label: "Chest or bust circumference",
      maxCm: 210,
      minCm: 40,
      quantity: "length",
    },
    waist: {
      defaultCm: 76,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 35,
      quantity: "length",
    },
    backLength: {
      defaultCm: 42,
      label: "Back waist length",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
  },
  intro:
    "Create a made-to-measure starting profile for doublet reconstruction.",
  kind: "doublet-reconstruction",
  mode: "historical",
  name: "Doublet Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const frockCoatReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 96,
      label: "Chest or bust circumference",
      minCm: 40,
      maxCm: 220,
    },
    height: {
      defaultCm: 175,
      label: "Body height",
      minCm: 80,
      maxCm: 240,
    },
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      minCm: 35,
      maxCm: 220,
    },
  },
  intro:
    "Create a made-to-measure starting profile for frock coat reconstruction.",
  kind: "frock-coat-reconstruction",
  mode: "historical",
  name: "Frock Coat Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const gambesonReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 96,
      label: "Chest or bust circumference",
      minCm: 40,
      maxCm: 220,
    },
    height: {
      defaultCm: 175,
      label: "Body height",
      minCm: 80,
      maxCm: 240,
    },
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      minCm: 35,
      maxCm: 220,
    },
  },
  intro:
    "Create a made-to-measure starting profile for gambeson reconstruction.",
  kind: "gambeson-reconstruction",
  mode: "historical",
  name: "Gambeson Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const hakamaReconstructionConfig = {
  fields: {
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 35,
      quantity: "length",
    },
    hip: {
      defaultCm: 100,
      label: "Hip circumference",
      maxCm: 220,
      minCm: 45,
      quantity: "length",
    },
    garmentLength: {
      defaultCm: 85,
      label: "Desired garment length",
      maxCm: 160,
      minCm: 20,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for hakama reconstruction.",
  kind: "hakama-reconstruction",
  mode: "historical",
  name: "Hakama Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const hanbokReconstructionConfig = {
  fields: {
    height: {
      defaultCm: 165,
      label: "Body height",
      maxCm: 230,
      minCm: 80,
      quantity: "length",
    },
    chest: {
      defaultCm: 92,
      label: "Chest or bust circumference",
      maxCm: 210,
      minCm: 40,
      quantity: "length",
    },
    sleeve: {
      defaultCm: 78,
      label: "Center-back-to-wrist length",
      maxCm: 120,
      minCm: 30,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for hanbok reconstruction.",
  kind: "hanbok-reconstruction",
  mode: "historical",
  name: "Hanbok Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const hanfuReconstructionConfig = {
  fields: {
    height: {
      defaultCm: 165,
      label: "Body height",
      maxCm: 230,
      minCm: 80,
      quantity: "length",
    },
    chest: {
      defaultCm: 92,
      label: "Chest or bust circumference",
      maxCm: 210,
      minCm: 40,
      quantity: "length",
    },
    sleeve: {
      defaultCm: 78,
      label: "Center-back-to-wrist length",
      maxCm: 120,
      minCm: 30,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for hanfu reconstruction.",
  kind: "hanfu-reconstruction",
  mode: "historical",
  name: "Hanfu Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const hoopSkirtReconstructionConfig = {
  fields: {
    waist: {
      defaultCm: 76,
      label: "Waist circumference",
      maxCm: 180,
      minCm: 35,
      quantity: "length",
    },
    waistToFloor: {
      defaultCm: 105,
      label: "Waist-to-floor length",
      maxCm: 150,
      minCm: 40,
      quantity: "length",
    },
  },
  intro:
    "Create a made-to-measure starting profile for hoop skirt reconstruction.",
  kind: "hoop-skirt-reconstruction",
  mode: "historical",
  name: "Hoop Skirt Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const kaftanReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 96,
      label: "Chest or bust circumference",
      minCm: 40,
      maxCm: 220,
    },
    height: {
      defaultCm: 175,
      label: "Body height",
      minCm: 80,
      maxCm: 240,
    },
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      minCm: 35,
      maxCm: 220,
    },
  },
  intro: "Create a made-to-measure starting profile for kaftan reconstruction.",
  kind: "kaftan-reconstruction",
  mode: "historical",
  name: "Kaftan Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const kiltReconstructionConfig = {
  fields: {
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 35,
      quantity: "length",
    },
    hip: {
      defaultCm: 100,
      label: "Hip circumference",
      maxCm: 220,
      minCm: 45,
      quantity: "length",
    },
    garmentLength: {
      defaultCm: 85,
      label: "Desired garment length",
      maxCm: 160,
      minCm: 20,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for kilt reconstruction.",
  kind: "kilt-reconstruction",
  mode: "historical",
  name: "Kilt Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const kimonoReconstructionConfig = {
  fields: {
    height: {
      defaultCm: 165,
      label: "Body height",
      maxCm: 230,
      minCm: 80,
      quantity: "length",
    },
    chest: {
      defaultCm: 92,
      label: "Chest or bust circumference",
      maxCm: 210,
      minCm: 40,
      quantity: "length",
    },
    sleeve: {
      defaultCm: 78,
      label: "Center-back-to-wrist length",
      maxCm: 120,
      minCm: 30,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for kimono reconstruction.",
  kind: "kimono-reconstruction",
  mode: "historical",
  name: "Kimono Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const kurtaReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 96,
      label: "Chest or bust circumference",
      minCm: 40,
      maxCm: 220,
    },
    height: {
      defaultCm: 175,
      label: "Body height",
      minCm: 80,
      maxCm: 240,
    },
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      minCm: 35,
      maxCm: 220,
    },
  },
  intro: "Create a made-to-measure starting profile for kurta reconstruction.",
  kind: "kurta-reconstruction",
  mode: "historical",
  name: "Kurta Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const peplosReconstructionConfig = {
  fields: {
    height: {
      defaultCm: 170,
      label: "Body height",
      maxCm: 230,
      minCm: 80,
      quantity: "length",
    },
    shoulder: {
      defaultCm: 42,
      label: "Shoulder width",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
    garmentLength: {
      defaultCm: 140,
      label: "Desired garment length",
      maxCm: 300,
      minCm: 40,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for peplos reconstruction.",
  kind: "peplos-reconstruction",
  mode: "historical",
  name: "Peplos Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const petticoatReconstructionConfig = {
  fields: {
    waist: {
      defaultCm: 76,
      label: "Waist circumference",
      maxCm: 180,
      minCm: 35,
      quantity: "length",
    },
    waistToFloor: {
      defaultCm: 105,
      label: "Waist-to-floor length",
      maxCm: 150,
      minCm: 40,
      quantity: "length",
    },
  },
  intro:
    "Create a made-to-measure starting profile for petticoat reconstruction.",
  kind: "petticoat-reconstruction",
  mode: "historical",
  name: "Petticoat Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const ponchoReconstructionConfig = {
  fields: {
    height: {
      defaultCm: 170,
      label: "Body height",
      maxCm: 230,
      minCm: 80,
      quantity: "length",
    },
    shoulder: {
      defaultCm: 42,
      label: "Shoulder width",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
    garmentLength: {
      defaultCm: 140,
      label: "Desired garment length",
      maxCm: 300,
      minCm: 40,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for poncho reconstruction.",
  kind: "poncho-reconstruction",
  mode: "historical",
  name: "Poncho Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const qipaoReconstructionConfig = {
  fields: {
    height: {
      defaultCm: 165,
      label: "Body height",
      maxCm: 230,
      minCm: 80,
      quantity: "length",
    },
    chest: {
      defaultCm: 92,
      label: "Chest or bust circumference",
      maxCm: 210,
      minCm: 40,
      quantity: "length",
    },
    sleeve: {
      defaultCm: 78,
      label: "Center-back-to-wrist length",
      maxCm: 120,
      minCm: 30,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for qipao reconstruction.",
  kind: "qipao-reconstruction",
  mode: "historical",
  name: "Qipao Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const sariReconstructionConfig = {
  fields: {
    height: {
      defaultCm: 170,
      label: "Body height",
      maxCm: 230,
      minCm: 80,
      quantity: "length",
    },
    shoulder: {
      defaultCm: 42,
      label: "Shoulder width",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
    garmentLength: {
      defaultCm: 140,
      label: "Desired garment length",
      maxCm: 300,
      minCm: 40,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for sari reconstruction.",
  kind: "sari-reconstruction",
  mode: "historical",
  name: "Sari Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const staysReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 94,
      label: "Chest or bust circumference",
      maxCm: 210,
      minCm: 40,
      quantity: "length",
    },
    waist: {
      defaultCm: 76,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 35,
      quantity: "length",
    },
    backLength: {
      defaultCm: 42,
      label: "Back waist length",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for stays reconstruction.",
  kind: "stays-reconstruction",
  mode: "historical",
  name: "Stays Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const thobeReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 96,
      label: "Chest or bust circumference",
      minCm: 40,
      maxCm: 220,
    },
    height: {
      defaultCm: 175,
      label: "Body height",
      minCm: 80,
      maxCm: 240,
    },
    waist: {
      defaultCm: 82,
      label: "Waist circumference",
      minCm: 35,
      maxCm: 220,
    },
  },
  intro: "Create a made-to-measure starting profile for thobe reconstruction.",
  kind: "thobe-reconstruction",
  mode: "historical",
  name: "Thobe Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const togaReconstructionConfig = {
  fields: {
    height: {
      defaultCm: 170,
      label: "Body height",
      maxCm: 230,
      minCm: 80,
      quantity: "length",
    },
    shoulder: {
      defaultCm: 42,
      label: "Shoulder width",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
    garmentLength: {
      defaultCm: 140,
      label: "Desired garment length",
      maxCm: 300,
      minCm: 40,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for toga reconstruction.",
  kind: "toga-reconstruction",
  mode: "historical",
  name: "Toga Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const waistcoatReconstructionConfig = {
  fields: {
    chest: {
      defaultCm: 94,
      label: "Chest or bust circumference",
      maxCm: 210,
      minCm: 40,
      quantity: "length",
    },
    waist: {
      defaultCm: 76,
      label: "Waist circumference",
      maxCm: 190,
      minCm: 35,
      quantity: "length",
    },
    backLength: {
      defaultCm: 42,
      label: "Back waist length",
      maxCm: 80,
      minCm: 20,
      quantity: "length",
    },
  },
  intro:
    "Create a made-to-measure starting profile for waistcoat reconstruction.",
  kind: "waistcoat-reconstruction",
  mode: "historical",
  name: "Waistcoat Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const yukataReconstructionConfig = {
  fields: {
    height: {
      defaultCm: 165,
      label: "Body height",
      maxCm: 230,
      minCm: 80,
      quantity: "length",
    },
    chest: {
      defaultCm: 92,
      label: "Chest or bust circumference",
      maxCm: 210,
      minCm: 40,
      quantity: "length",
    },
    sleeve: {
      defaultCm: 78,
      label: "Center-back-to-wrist length",
      maxCm: 120,
      minCm: 30,
      quantity: "length",
    },
  },
  intro: "Create a made-to-measure starting profile for yukata reconstruction.",
  kind: "yukata-reconstruction",
  mode: "historical",
  name: "Yukata Size Reconstruction",
} as const satisfies MeasurementSizeConfig;

export const measurementSizeConfigs = {
  belt: beltConfig,
  collar: collarConfig,
  dress: dressConfig,
  "dress-shirt": dressShirtConfig,
  gloves: glovesConfig,
  pants: pantsConfig,
  ring: ringConfig,
  shawl: shawlConfig,
  "smart-ring": smartRingConfig,
  socks: socksConfig,
  "suit-jacket": suitJacketConfig,
  sweater: sweaterConfig,
  "t-shirt": tShirtConfig,
  "watch-band": watchBandConfig,
  "baby-clothing": babyClothingConfig,
  blazer: blazerConfig,
  bra: braConfig,
  "children-clothing": childrenClothingConfig,
  coat: coatConfig,
  "compression-garment": compressionGarmentConfig,
  jacket: jacketConfig,
  jeans: jeansConfig,
  leggings: leggingsConfig,
  "maternity-clothing": maternityClothingConfig,
  overalls: overallsConfig,
  shorts: shortsConfig,
  skirt: skirtConfig,
  swimwear: swimwearConfig,
  underwear: underwearConfig,
  wetsuit: wetsuitConfig,
  anklet: ankletConfig,
  bangle: bangleConfig,
  "bow-tie": bowTieConfig,
  bracelet: braceletConfig,
  cap: capConfig,
  choker: chokerConfig,
  glasses: glassesConfig,
  hat: hatConfig,
  headphones: headphonesConfig,
  helmet: helmetConfig,
  necklace: necklaceConfig,
  smartwatch: smartwatchConfig,
  sunglasses: sunglassesConfig,
  tie: tieConfig,
  "watch-case": watchCaseConfig,
  blanket: blanketConfig,
  curtain: curtainConfig,
  "duvet-cover": duvetCoverConfig,
  duvet: duvetConfig,
  "fitted-sheet": fittedSheetConfig,
  "flat-sheet": flatSheetConfig,
  mattress: mattressConfig,
  pillow: pillowConfig,
  pillowcase: pillowcaseConfig,
  rug: rugConfig,
  tablecloth: tableclothConfig,
  "book-format": bookFormatConfig,
  envelope: envelopeConfig,
  paper: paperConfig,
  photograph: photographConfig,
  "picture-frame": pictureFrameConfig,
  battery: batteryConfig,
  "drill-bit": drillBitConfig,
  "electrical-connector": electricalConnectorConfig,
  lumber: lumberConfig,
  nut: nutConfig,
  pipe: pipeConfig,
  screw: screwConfig,
  "tire-wheel": tireWheelConfig,
  "wire-gauge": wireGaugeConfig,
  boot: bootConfig,
  "climbing-shoe": climbingShoeConfig,
  "hiking-boot": hikingBootConfig,
  "ice-skate": iceSkateConfig,
  "roller-skate": rollerSkateConfig,
  "ski-boot": skiBootConfig,
  snowshoe: snowshoeConfig,
  backpack: backpackConfig,
  "bicycle-frame": bicycleFrameConfig,
  "climbing-harness": climbingHarnessConfig,
  "golf-club": golfClubConfig,
  "life-jacket": lifeJacketConfig,
  luggage: luggageConfig,
  "racket-grip": racketGripConfig,
  ski: skiConfig,
  snowboard: snowboardConfig,
  surfboard: surfboardConfig,
  "child-car-seat": childCarSeatConfig,
  "protective-pad": protectivePadConfig,
  "dog-coat": dogCoatConfig,
  "dog-collar": dogCollarConfig,
  "dog-harness": dogHarnessConfig,
  "dog-shoe": dogShoeConfig,
  "horse-blanket": horseBlanketConfig,
  saddle: saddleConfig,
  "abaya-reconstruction": abayaReconstructionConfig,
  "bodice-reconstruction": bodiceReconstructionConfig,
  "breeches-reconstruction": breechesReconstructionConfig,
  "bustle-reconstruction": bustleReconstructionConfig,
  "chemise-reconstruction": chemiseReconstructionConfig,
  "chiton-reconstruction": chitonReconstructionConfig,
  "cloak-reconstruction": cloakReconstructionConfig,
  "corset-reconstruction": corsetReconstructionConfig,
  "crinoline-reconstruction": crinolineReconstructionConfig,
  "dhoti-reconstruction": dhotiReconstructionConfig,
  "doublet-reconstruction": doubletReconstructionConfig,
  "frock-coat-reconstruction": frockCoatReconstructionConfig,
  "gambeson-reconstruction": gambesonReconstructionConfig,
  "hakama-reconstruction": hakamaReconstructionConfig,
  "hanbok-reconstruction": hanbokReconstructionConfig,
  "hanfu-reconstruction": hanfuReconstructionConfig,
  "hoop-skirt-reconstruction": hoopSkirtReconstructionConfig,
  "kaftan-reconstruction": kaftanReconstructionConfig,
  "kilt-reconstruction": kiltReconstructionConfig,
  "kimono-reconstruction": kimonoReconstructionConfig,
  "kurta-reconstruction": kurtaReconstructionConfig,
  "peplos-reconstruction": peplosReconstructionConfig,
  "petticoat-reconstruction": petticoatReconstructionConfig,
  "poncho-reconstruction": ponchoReconstructionConfig,
  "qipao-reconstruction": qipaoReconstructionConfig,
  "sari-reconstruction": sariReconstructionConfig,
  "stays-reconstruction": staysReconstructionConfig,
  "thobe-reconstruction": thobeReconstructionConfig,
  "toga-reconstruction": togaReconstructionConfig,
  "waistcoat-reconstruction": waistcoatReconstructionConfig,
  "yukata-reconstruction": yukataReconstructionConfig,
} as const satisfies Record<string, MeasurementSizeConfig>;
