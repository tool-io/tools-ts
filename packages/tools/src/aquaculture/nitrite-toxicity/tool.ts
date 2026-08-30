import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly nitriteNitrogenMgPerLiter: number;
  readonly chlorideMgPerLiter: number;
  readonly comparisonNitriteNitrogenMgPerLiter: number;
  readonly requiredChlorideToNitriteNRatio: number;
}>;
export type Output = Readonly<{
  readonly nitriteComparisonRatio: number;
  readonly chlorideToNitriteNRatio: number;
  readonly chlorideDeficitMgPerLiter: number;
  readonly meetsCallerChlorideRatio: boolean;
}>;
const inputFields = [
  {
    id: "nitriteNitrogenMgPerLiter",
    label: "Nitrite nitrogen mg per liter",
    kind: "number",
  },
  { id: "chlorideMgPerLiter", label: "Chloride mg per liter", kind: "number" },
  {
    id: "comparisonNitriteNitrogenMgPerLiter",
    label: "Comparison nitrite nitrogen mg per liter",
    kind: "number",
  },
  {
    id: "requiredChlorideToNitriteNRatio",
    label: "Required chloride to nitrite n ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.nitriteNitrogenMgPerLiter, "nitriteNitrogenMgPerLiter");
  positive(
    input.comparisonNitriteNitrogenMgPerLiter,
    "comparisonNitriteNitrogenMgPerLiter",
  );
  positive(
    input.requiredChlorideToNitriteNRatio,
    "requiredChlorideToNitriteNRatio",
  );
  nonnegative(input.chlorideMgPerLiter, "chlorideMgPerLiter");
  const chlorideToNitriteNRatio =
    input.chlorideMgPerLiter / input.nitriteNitrogenMgPerLiter;
  return {
    nitriteComparisonRatio:
      input.nitriteNitrogenMgPerLiter /
      input.comparisonNitriteNitrogenMgPerLiter,
    chlorideToNitriteNRatio,
    chlorideDeficitMgPerLiter: Math.max(
      0,
      input.requiredChlorideToNitriteNRatio * input.nitriteNitrogenMgPerLiter -
        input.chlorideMgPerLiter,
    ),
    meetsCallerChlorideRatio:
      chlorideToNitriteNRatio >= input.requiredChlorideToNitriteNRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  nitriteNitrogenMgPerLiter: 1,
  chlorideMgPerLiter: 10,
  comparisonNitriteNitrogenMgPerLiter: 0.5,
  requiredChlorideToNitriteNRatio: 20,
} satisfies Input;
export const exampleOutput = {
  nitriteComparisonRatio: 2,
  chlorideToNitriteNRatio: 10,
  chlorideDeficitMgPerLiter: 10,
  meetsCallerChlorideRatio: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/nitrite-toxicity",
  title: "Nitrite Toxicity",
  description:
    "Screen measured nitrite on an explicit NO2-N basis against caller concentration and chloride-ratio criteria; no universal species toxicity limit, diagnosis or salt dosing recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "nitriteComparisonRatio",
      label: "Nitrite comparison ratio",
      kind: "number",
    },
    {
      id: "chlorideToNitriteNRatio",
      label: "Chloride to nitrite n ratio",
      kind: "number",
    },
    {
      id: "chlorideDeficitMgPerLiter",
      label: "Chloride deficit mg per liter",
      kind: "number",
    },
    {
      id: "meetsCallerChlorideRatio",
      label: "Meets caller chloride ratio",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      nitriteNitrogenMgPerLiter: value.nitriteNitrogenMgPerLiter as number,
      chlorideMgPerLiter: value.chlorideMgPerLiter as number,
      comparisonNitriteNitrogenMgPerLiter:
        value.comparisonNitriteNitrogenMgPerLiter as number,
      requiredChlorideToNitriteNRatio:
        value.requiredChlorideToNitriteNRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
