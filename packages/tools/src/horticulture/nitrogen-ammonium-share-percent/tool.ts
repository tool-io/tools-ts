import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly componentTotalNitrogenMassMg: readonly number[];
  readonly componentAmmoniumNitrogenFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalNitrogenMassMg: number;
  readonly totalAmmoniumNitrogenMassMg: number;
  readonly ammoniumShareOfTotalNitrogen: number;
}>;
const inputFields = [
  {
    id: "componentTotalNitrogenMassMg",
    label: "Component total nitrogen mass mg",
    kind: "numberList",
  },
  {
    id: "componentAmmoniumNitrogenFractions",
    label: "Component ammonium nitrogen fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.componentTotalNitrogenMassMg.forEach((v) =>
    nonnegative(v, "componentTotalNitrogenMassMg"),
  );
  input.componentAmmoniumNitrogenFractions.forEach((v) =>
    fraction(v, "componentAmmoniumNitrogenFractions"),
  );
  aligned(
    input.componentTotalNitrogenMassMg,
    input.componentAmmoniumNitrogenFractions,
    "componentTotalNitrogenMassMg",
  );
  const total = sum(input.componentTotalNitrogenMassMg);
  positive(total, "totalNitrogen");
  const ammonium = sum(
    input.componentTotalNitrogenMassMg.map(
      (v, i) => v * input.componentAmmoniumNitrogenFractions[i],
    ),
  );
  return {
    totalNitrogenMassMg: total,
    totalAmmoniumNitrogenMassMg: ammonium,
    ammoniumShareOfTotalNitrogen: ammonium / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  componentTotalNitrogenMassMg: [100, 300],
  componentAmmoniumNitrogenFractions: [0.2, 0.5],
} satisfies Input;
export const exampleOutput = {
  totalNitrogenMassMg: 400,
  totalAmmoniumNitrogenMassMg: 170,
  ammoniumShareOfTotalNitrogen: 0.425,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/nitrogen-ammonium-share-percent",
  title: "Nitrogen Ammonium Share Percent Calculator",
  description:
    "Reconcile actual multi-component nitrogen mass/speciation inventory with mass-weighted ammonium share; not unweighted percentage mean, total fertilizer mass or a crop ammonium recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalNitrogenMassMg",
      label: "Total nitrogen mass mg",
      kind: "number",
    },
    {
      id: "totalAmmoniumNitrogenMassMg",
      label: "Total ammonium nitrogen mass mg",
      kind: "number",
    },
    {
      id: "ammoniumShareOfTotalNitrogen",
      label: "Ammonium share of total nitrogen",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      componentTotalNitrogenMassMg:
        value.componentTotalNitrogenMassMg as readonly number[],
      componentAmmoniumNitrogenFractions:
        value.componentAmmoniumNitrogenFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
