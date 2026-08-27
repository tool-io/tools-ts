import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReeNormalizationInput = {
  readonly lanthanumPpm: number;
  readonly ceriumPpm: number;
  readonly praseodymiumPpm: number;
  readonly neodymiumPpm: number;
  readonly samariumPpm: number;
  readonly europiumPpm: number;
  readonly gadoliniumPpm: number;
  readonly terbiumPpm: number;
  readonly dysprosiumPpm: number;
  readonly holmiumPpm: number;
  readonly erbiumPpm: number;
  readonly thuliumPpm: number;
  readonly ytterbiumPpm: number;
  readonly lutetiumPpm: number;
  readonly reference?: "chondrite" | "paas";
};

export type ReeNormalizationOutput = {
  readonly normalizedValues: readonly number[];
  readonly ceriumAnomaly: number;
  readonly europiumAnomaly: number;
};

const ELEMENT_KEYS = [
  "lanthanum",
  "cerium",
  "praseodymium",
  "neodymium",
  "samarium",
  "europium",
  "gadolinium",
  "terbium",
  "dysprosium",
  "holmium",
  "erbium",
  "thulium",
  "ytterbium",
  "lutetium",
] as const;

type ElementKey = (typeof ELEMENT_KEYS)[number];

const REFERENCE_PPM: Record<
  "chondrite" | "paas",
  Record<ElementKey, number>
> = {
  chondrite: {
    lanthanum: 0.237,
    cerium: 0.613,
    praseodymium: 0.0932,
    neodymium: 0.457,
    samarium: 0.148,
    europium: 0.0563,
    gadolinium: 0.199,
    terbium: 0.0361,
    dysprosium: 0.246,
    holmium: 0.0556,
    erbium: 0.16,
    thulium: 0.0247,
    ytterbium: 0.165,
    lutetium: 0.0254,
  },
  paas: {
    lanthanum: 32,
    cerium: 63,
    praseodymium: 7.1,
    neodymium: 27,
    samarium: 5.9,
    europium: 1.18,
    gadolinium: 5.2,
    terbium: 0.94,
    dysprosium: 4.68,
    holmium: 0.99,
    erbium: 2.85,
    thulium: 0.3,
    ytterbium: 1.96,
    lutetium: 0.217,
  },
};

const ppmOf = (input: Record<string, unknown>, key: ElementKey): number => {
  const value = input[`${key}Ppm`];
  if (typeof value !== "number")
    return simpleError(
      `${key}Ppm`,
      "Concentrations must be greater than zero.",
      "invalid_concentration",
    );
  if (!(value > 0))
    return simpleError(
      `${key}Ppm`,
      "Concentrations must be greater than zero.",
      "invalid_concentration",
    );
  return value;
};

export const calculateReeNormalization = (
  input: ReeNormalizationInput,
): ReeNormalizationOutput => {
  const table = REFERENCE_PPM[input.reference ?? "chondrite"];
  const record = input as unknown as Record<string, unknown>;
  const normalizedValues = ELEMENT_KEYS.map(
    (key) => ppmOf(record, key) / table[key],
  );
  return {
    normalizedValues,
    ceriumAnomaly:
      normalizedValues[1] /
      Math.sqrt(normalizedValues[0] * normalizedValues[2]),
    europiumAnomaly:
      normalizedValues[5] /
      Math.sqrt(normalizedValues[4] * normalizedValues[6]),
  };
};

export const reeNormalizationExample = {
  input: {
    lanthanumPpm: 10,
    ceriumPpm: 26,
    praseodymiumPpm: 3.5,
    neodymiumPpm: 18,
    samariumPpm: 4.5,
    europiumPpm: 1.6,
    gadoliniumPpm: 5.2,
    terbiumPpm: 1.0,
    dysprosiumPpm: 6.3,
    holmiumPpm: 1.4,
    erbiumPpm: 4.0,
    thuliumPpm: 0.62,
    ytterbiumPpm: 4.0,
    lutetiumPpm: 0.61,
    reference: "chondrite",
  },
  output: {
    normalizedValues: [
      42.19409282700422, 42.41435562805873, 37.553648068669524,
      39.387308533916844, 30.405405405405407, 28.41918294849023,
      26.13065326633166, 27.700831024930746, 25.609756097560975,
      25.179856115107913, 25, 25.101214574898787, 24.242424242424242,
      24.015748031496063,
    ],
    ceriumAnomaly: 1.0655184654852998,
    europiumAnomaly: 1.0082333412173274,
  },
} satisfies ToolExample<ReeNormalizationInput, ReeNormalizationOutput>;

const elementField = (symbol: string, name: string) => ({
  description: `${symbol} (${name}) concentration in parts per million.`,
  id: `${name}Ppm`,
  kind: "number" as const,
  label: `${name} ppm`,
  minimum: 0,
});

export const reeNormalizationTool = createSimpleTool({
  id: "geology/ree-normalization",
  title: "REE Normalization Calculator",
  description:
    "Normalize rare earth element concentrations to chondrite or PAAS and report Ce and Eu anomalies.",
  inputs: [
    elementField("La", "lanthanum"),
    elementField("Ce", "cerium"),
    elementField("Pr", "praseodymium"),
    elementField("Nd", "neodymium"),
    elementField("Sm", "samarium"),
    elementField("Eu", "europium"),
    elementField("Gd", "gadolinium"),
    elementField("Tb", "terbium"),
    elementField("Dy", "dysprosium"),
    elementField("Ho", "holmium"),
    elementField("Er", "erbium"),
    elementField("Tm", "thulium"),
    elementField("Yb", "ytterbium"),
    elementField("Lu", "lutetium"),
    {
      default: "chondrite",
      description: "Reference material for normalization.",
      enum: ["chondrite", "paas"],
      id: "reference",
      kind: "string",
      label: "Reference",
    },
  ],
  outputs: [
    {
      description:
        "Normalized values ordered La, Ce, Pr, Nd, Sm, Eu, Gd, Tb, Dy, Ho, Er, Tm, Yb, Lu.",
      id: "normalizedValues",
      kind: "numberList",
      label: "Normalized values",
    },
    {
      description:
        "Cerium anomaly Ce/Ce* against the geometric mean of La and Pr.",
      id: "ceriumAnomaly",
      kind: "number",
      label: "Ce anomaly",
    },
    {
      description:
        "Europium anomaly Eu/Eu* against the geometric mean of Sm and Gd.",
      id: "europiumAnomaly",
      kind: "number",
      label: "Eu anomaly",
    },
  ],
  calculate: (input) =>
    calculateReeNormalization(input as unknown as ReeNormalizationInput),
});

export const runReeNormalization = reeNormalizationTool.execute;
export default reeNormalizationTool;
