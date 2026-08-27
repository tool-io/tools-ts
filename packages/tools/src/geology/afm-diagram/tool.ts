import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AfmDiagramInput = {
  readonly feOWtPercent: number;
  readonly fe2O3WtPercent?: number;
  readonly mgoWtPercent: number;
  readonly na2OWtPercent: number;
  readonly k2OWtPercent: number;
};

export type AfmDiagramOutput = {
  readonly feOTotalWtPercent: number;
  readonly aPercent: number;
  readonly fPercent: number;
  readonly mPercent: number;
};

/** Fe2O3 -> FeO mass conversion factor (2*FeO / Fe2O3 molar masses). */
const FE2O3_TO_FEO = (2 * 71.844) / 159.687;

const nonNegative = (value: unknown): value is number =>
  typeof value === "number" && value >= 0 && Number.isFinite(value);

export const calculateAfmDiagram = (
  input: AfmDiagramInput,
): AfmDiagramOutput => {
  const values: [string, number][] = [
    ["feOWtPercent", input.feOWtPercent],
    ["fe2O3WtPercent", input.fe2O3WtPercent ?? 0],
    ["mgoWtPercent", input.mgoWtPercent],
    ["na2OWtPercent", input.na2OWtPercent],
    ["k2OWtPercent", input.k2OWtPercent],
  ];
  for (const [key, value] of values)
    if (!nonNegative(value))
      simpleError(
        key,
        "Oxide percentages must be finite and non-negative.",
        "invalid_oxide",
      );
  const feOTotalWtPercent =
    input.feOWtPercent + FE2O3_TO_FEO * (input.fe2O3WtPercent ?? 0);
  const a = input.na2OWtPercent + input.k2OWtPercent;
  const sum = a + feOTotalWtPercent + input.mgoWtPercent;
  if (sum <= 0)
    simpleError(
      "mgoWtPercent",
      "AFM components must not all be zero.",
      "invalid_oxide",
    );
  return {
    feOTotalWtPercent,
    aPercent: (100 * a) / sum,
    fPercent: (100 * feOTotalWtPercent) / sum,
    mPercent: (100 * input.mgoWtPercent) / sum,
  };
};

export const afmDiagramExample = {
  input: {
    feOWtPercent: 8,
    fe2O3WtPercent: 2,
    mgoWtPercent: 4,
    na2OWtPercent: 3,
    k2OWtPercent: 1,
  },
  output: {
    feOTotalWtPercent: 9.799620507618027,
    aPercent: 22.472389219129965,
    fPercent: 55.05522156174006,
    mPercent: 22.472389219129965,
  },
} satisfies ToolExample<AfmDiagramInput, AfmDiagramOutput>;

export const afmDiagramTool = createSimpleTool({
  id: "geology/afm-diagram",
  title: "AFM Diagram Calculator",
  description:
    "Convert whole-rock oxides to AFM coordinates with ferric iron recalculated to FeO for the tholeiitic-calc-alkaline AFM triangle.",
  inputs: [
    {
      description: "FeO weight percent.",
      id: "feOWtPercent",
      kind: "number",
      label: "FeO",
      minimum: 0,
    },
    {
      default: 0,
      description: "Fe2O3 weight percent, recalculated to FeO.",
      id: "fe2O3WtPercent",
      kind: "number",
      label: "Fe2O3",
      minimum: 0,
    },
    {
      description: "MgO weight percent.",
      id: "mgoWtPercent",
      kind: "number",
      label: "MgO",
      minimum: 0,
    },
    {
      description: "Na2O weight percent.",
      id: "na2OWtPercent",
      kind: "number",
      label: "Na2O",
      minimum: 0,
    },
    {
      description: "K2O weight percent.",
      id: "k2OWtPercent",
      kind: "number",
      label: "K2O",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total iron expressed as FeO.",
      id: "feOTotalWtPercent",
      kind: "number",
      label: "FeO total",
    },
    {
      description: "(Na2O+K2O) apex percent of the AFM sum.",
      id: "aPercent",
      kind: "number",
      label: "A %",
    },
    {
      description: "FeO total apex percent.",
      id: "fPercent",
      kind: "number",
      label: "F %",
    },
    {
      description: "MgO apex percent.",
      id: "mPercent",
      kind: "number",
      label: "M %",
    },
  ],
  calculate: (input) =>
    calculateAfmDiagram(input as unknown as AfmDiagramInput),
});

export const runAfmDiagram = afmDiagramTool.execute;
export default afmDiagramTool;
