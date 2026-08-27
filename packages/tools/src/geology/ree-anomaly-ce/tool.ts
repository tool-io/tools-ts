import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReeAnomalyCeInput = {
  readonly lanthanumPpm: number;
  readonly ceriumPpm: number;
  readonly praseodymiumPpm: number;
  readonly reference?: "chondrite" | "paas";
};

export type ReeAnomalyCeOutput = {
  readonly ceriumAnomaly: number;
};

const REFERENCE_PPM = {
  chondrite: { lanthanum: 0.237, cerium: 0.613, praseodymium: 0.0932 },
  paas: { lanthanum: 32, cerium: 63, praseodymium: 7.1 },
} as const;

export const calculateReeAnomalyCe = (
  input: ReeAnomalyCeInput,
): ReeAnomalyCeOutput => {
  const table = REFERENCE_PPM[input.reference ?? "chondrite"];
  for (const key of ["lanthanumPpm", "ceriumPpm", "praseodymiumPpm"] as const) {
    if (!((input[key] as number) > 0))
      simpleError(
        key,
        "Concentrations must be greater than zero.",
        "invalid_concentration",
      );
  }
  const laN = input.lanthanumPpm / table.lanthanum;
  const ceN = input.ceriumPpm / table.cerium;
  const prN = input.praseodymiumPpm / table.praseodymium;
  return { ceriumAnomaly: ceN / Math.sqrt(laN * prN) };
};

export const reeAnomalyCeExample = {
  input: {
    lanthanumPpm: 10,
    ceriumPpm: 26,
    praseodymiumPpm: 3.5,
    reference: "chondrite",
  },
  output: { ceriumAnomaly: 1.0655184654852998 },
} satisfies ToolExample<ReeAnomalyCeInput, ReeAnomalyCeOutput>;

export const reeAnomalyCeTool = createSimpleTool({
  id: "geology/ree-anomaly-ce",
  title: "REE Anomaly Ce Calculator",
  description:
    "Compute the chondrite- or PAAS-normalized cerium anomaly Ce/Ce* from La, Ce and Pr concentrations.",
  inputs: [
    {
      description: "Lanthanum concentration in ppm.",
      id: "lanthanumPpm",
      kind: "number",
      label: "La",
      minimum: 0,
    },
    {
      description: "Cerium concentration in ppm.",
      id: "ceriumPpm",
      kind: "number",
      label: "Ce",
      minimum: 0,
    },
    {
      description: "Praseodymium concentration in ppm.",
      id: "praseodymiumPpm",
      kind: "number",
      label: "Pr",
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
      description: "Cerium anomaly Ce_N / sqrt(La_N * Pr_N).",
      id: "ceriumAnomaly",
      kind: "number",
      label: "Ce anomaly",
    },
  ],
  calculate: (input) =>
    calculateReeAnomalyCe(input as unknown as ReeAnomalyCeInput),
});

export const runReeAnomalyCe = reeAnomalyCeTool.execute;
export default reeAnomalyCeTool;
