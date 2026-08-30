import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const lubricantEntries = {
  hp1300: {
    application:
      "Moebius lists 9104 for slow moving precision parts under significant pressure and torque and, in its watch catalog, for pivoting mobiles of medium to large torque.",
    caution:
      "Choose the viscosity and point from the caliber or equipment specification; 9104 is not a universal substitute for every watch lubricant.",
    productName: "SYNT-HP 1300 9104",
    viscosityAt20C: 1250,
  },
  oil9010: {
    application:
      "Moebius lists 9010 for regulating parts and fast moving parts; its catalog associates the oil with balance staffs and fast small-torque mobiles.",
    caution:
      "Choose the exact point and quantity from the caliber or equipment specification; a product family name alone is not a full lubrication schedule.",
    productName: "Synt-A-Lube 9010",
    viscosityAt20C: 150,
  },
} as const;

export type MoebiusOilProduct = keyof typeof lubricantEntries;

export type MoebiusOilLookupInput = {
  readonly product: MoebiusOilProduct;
};

export type MoebiusOilLookupOutput = {
  readonly application: string;
  readonly caution: string;
  readonly product: MoebiusOilProduct;
  readonly productName: string;
  readonly viscosityAt20C: number;
};

export const lookupMoebius9010Hp1300Purpose = (
  input: MoebiusOilLookupInput,
): MoebiusOilLookupOutput => {
  const entry = lubricantEntries[input.product];
  if (entry === undefined)
    simpleError(
      "product",
      "Moebius oil product is not supported.",
      "unsupported_product",
    );
  return {
    application: entry.application,
    caution: entry.caution,
    product: input.product,
    productName: entry.productName,
    viscosityAt20C: entry.viscosityAt20C,
  };
};

export const moebiusOilLookupExample = {
  input: { product: "oil9010" },
  output: {
    application:
      "Moebius lists 9010 for regulating parts and fast moving parts; its catalog associates the oil with balance staffs and fast small-torque mobiles.",
    caution:
      "Choose the exact point and quantity from the caliber or equipment specification; a product family name alone is not a full lubrication schedule.",
    product: "oil9010",
    productName: "Synt-A-Lube 9010",
    viscosityAt20C: 150,
  },
} satisfies ToolExample<MoebiusOilLookupInput, MoebiusOilLookupOutput>;

export const moebiusOilLookupTool = createSimpleTool({
  calculate: (input) =>
    lookupMoebius9010Hp1300Purpose({
      product: input.product as MoebiusOilProduct,
    }),
  description:
    "Return the published product identity, 20°C viscosity class, application family, and selection caution for Moebius 9010 or SYNT-HP 1300.",
  id: "horology/moebius-9010-hp1300-purpose-lookup",
  inputs: [
    {
      enum: ["oil9010", "hp1300"],
      id: "product",
      kind: "string",
      label: "Moebius watch lubricant",
    },
  ],
  outputs: [
    {
      id: "application",
      kind: "string",
      label: "Published application family",
    },
    { id: "caution", kind: "string", label: "Selection caution" },
    { id: "product", kind: "string", label: "Moebius watch lubricant" },
    { id: "productName", kind: "string", label: "Published product name" },
    {
      id: "viscosityAt20C",
      kind: "number",
      label: "Viscosity at 20 degrees Celsius",
      minimum: 0,
      unit: "cSt",
    },
  ],
  title: "Moebius 9010 HP1300 Purpose Lookup",
});

export const runMoebiusOilLookup = moebiusOilLookupTool.execute;
export default moebiusOilLookupTool;
