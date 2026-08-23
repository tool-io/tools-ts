import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type WindGustFactorInput = {
  readonly gustFactorPercent?: number;
  readonly gustSpreadKt: number;
};

export type WindGustFactorOutput = {
  readonly gustFactorKt: number;
};

const DEFAULT_GUST_FACTOR_PERCENT = 50;

export const windGustFactorExample = {
  input: { gustFactorPercent: 50, gustSpreadKt: 20 },
  output: { gustFactorKt: 10 },
} satisfies ToolExample<WindGustFactorInput, WindGustFactorOutput>;

export const calculateWindGustFactor = (
  input: WindGustFactorInput,
): WindGustFactorOutput => ({
  gustFactorKt:
    (input.gustSpreadKt *
      (input.gustFactorPercent ?? DEFAULT_GUST_FACTOR_PERCENT)) /
    100,
});

export const windGustFactorTool = createSimpleTool({
  id: "aviation/wind-gust-factor",
  title: "Wind Gust Factor Calculator",
  description:
    "Convert a gust spread into a gust factor using a percentage of the spread.",
  inputs: [
    {
      default: DEFAULT_GUST_FACTOR_PERCENT,
      description:
        "Share of the spread counted as gust factor; defaults to 50%.",
      id: "gustFactorPercent",
      label: "Gust factor percentage",
      kind: "number",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "gustSpreadKt",
      label: "Gust spread",
      kind: "number",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    { id: "gustFactorKt", label: "Gust factor", kind: "number", unit: "kt" },
  ],
  calculate: (input) =>
    calculateWindGustFactor({
      gustFactorPercent: input.gustFactorPercent as number | undefined,
      gustSpreadKt: input.gustSpreadKt as number,
    }),
});
export const runWindGustFactor = windGustFactorTool.execute;
export default windGustFactorTool;
