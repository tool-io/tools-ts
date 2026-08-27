import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReeAnomalyEuInput = {
  readonly samariumPpm: number;
  readonly europiumPpm: number;
  readonly gadoliniumPpm: number;
  readonly reference?: "chondrite" | "paas";
};

export type ReeAnomalyEuOutput = {
  readonly europiumAnomaly: number;
};

const REFERENCE_PPM = {
  chondrite: { samarium: 0.148, europium: 0.0563, gadolinium: 0.199 },
  paas: { samarium: 5.9, europium: 1.18, gadolinium: 5.2 },
} as const;

export const calculateReeAnomalyEu = (
  input: ReeAnomalyEuInput,
): ReeAnomalyEuOutput => {
  const table = REFERENCE_PPM[input.reference ?? "chondrite"];
  for (const key of ["samariumPpm", "europiumPpm", "gadoliniumPpm"] as const) {
    if (!((input[key] as number) > 0))
      simpleError(
        key,
        "Concentrations must be greater than zero.",
        "invalid_concentration",
      );
  }
  const smN = input.samariumPpm / table.samarium;
  const euN = input.europiumPpm / table.europium;
  const gdN = input.gadoliniumPpm / table.gadolinium;
  return { europiumAnomaly: euN / Math.sqrt(smN * gdN) };
};

export const reeAnomalyEuExample = {
  input: {
    samariumPpm: 4.5,
    europiumPpm: 1.6,
    gadoliniumPpm: 5.2,
    reference: "chondrite",
  },
  output: { europiumAnomaly: 1.0082333412173274 },
} satisfies ToolExample<ReeAnomalyEuInput, ReeAnomalyEuOutput>;

export const reeAnomalyEuTool = createSimpleTool({
  id: "geology/ree-anomaly-eu",
  title: "REE Anomaly Eu Calculator",
  description:
    "Compute the chondrite- or PAAS-normalized europium anomaly Eu/Eu* from Sm, Eu and Gd concentrations.",
  inputs: [
    {
      description: "Samarium concentration in ppm.",
      id: "samariumPpm",
      kind: "number",
      label: "Sm",
      minimum: 0,
    },
    {
      description: "Europium concentration in ppm.",
      id: "europiumPpm",
      kind: "number",
      label: "Eu",
      minimum: 0,
    },
    {
      description: "Gadolinium concentration in ppm.",
      id: "gadoliniumPpm",
      kind: "number",
      label: "Gd",
      minimum: 0,
    },
    {
      default: "chondrite",
      description: "Reference material.",
      enum: ["chondrite", "paas"],
      id: "reference",
      kind: "string",
      label: "Reference",
    },
  ],
  outputs: [
    {
      description: "Europium anomaly Eu_N / sqrt(Sm_N * Gd_N).",
      id: "europiumAnomaly",
      kind: "number",
      label: "Eu anomaly",
    },
  ],
  calculate: (input) =>
    calculateReeAnomalyEu(input as unknown as ReeAnomalyEuInput),
});

export const runReeAnomalyEu = reeAnomalyEuTool.execute;
export default reeAnomalyEuTool;
