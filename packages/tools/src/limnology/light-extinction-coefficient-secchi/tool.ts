import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly secchiDepthsM: readonly number[];
  readonly callerExtinctionSecchiProduct: number;
}>;
export type Output = Readonly<{
  readonly secchiEstimatedExtinctionCoefficientsPerM: readonly number[];
}>;
const inputFields = [
  { id: "secchiDepthsM", label: "Secchi depths m", kind: "numberList" },
  {
    id: "callerExtinctionSecchiProduct",
    label: "Caller extinction secchi product",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.secchiDepthsM.forEach((v) => positive(v, "secchiDepthsM"));
  positive(
    input.callerExtinctionSecchiProduct,
    "callerExtinctionSecchiProduct",
  );
  return {
    secchiEstimatedExtinctionCoefficientsPerM: input.secchiDepthsM.map(
      (z) => input.callerExtinctionSecchiProduct / z,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  secchiDepthsM: [1, 2],
  callerExtinctionSecchiProduct: 1.7,
} satisfies Input;
export const exampleOutput = {
  secchiEstimatedExtinctionCoefficientsPerM: [1.7, 0.85],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/light-extinction-coefficient-secchi",
  title: "Light Extinction Coefficient Secchi Calculator",
  description:
    "Estimate optical attenuation from paired measured Secchi depths using explicit calibrated dimensionless k·Z product; not assumed measured extinction, spectral turbidity decomposition or layered light propagation.",
  inputs: inputFields,
  outputs: [
    {
      id: "secchiEstimatedExtinctionCoefficientsPerM",
      label: "Secchi estimated extinction coefficients per m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      secchiDepthsM: value.secchiDepthsM as readonly number[],
      callerExtinctionSecchiProduct:
        value.callerExtinctionSecchiProduct as number,
    }),
});
export const run = tool.execute;
export default tool;
