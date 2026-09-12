import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bandRatio } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualUniformFrequencyCentersHz: readonly number[];
  readonly actualPsd: readonly number[];
  readonly actualBinWidthHz: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualUniformFrequencyCentersHz",
    label: "Actual uniform frequency centers hz",
    kind: "numberList",
  },
  { id: "actualPsd", label: "Actual psd", kind: "numberList" },
  { id: "actualBinWidthHz", label: "Actual bin width hz", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    actualBandPowerRatio: bandRatio(
      input.actualUniformFrequencyCentersHz,
      input.actualPsd,
      input.actualBinWidthHz,
      4,
      8,
      12,
      30,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualUniformFrequencyCentersHz: [4, 8, 12],
    actualPsd: [1, 2, 4],
    actualBinWidthHz: 4,
  },
  output: { result: { actualBandPowerRatio: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/theta-beta-ratio",
  title: "Theta Beta Ratio Calculator",
  description:
    "Actual qualified band powers quotient from supplied uniform PSD centers\u00d7width, half open MNE bands alpha8\u201312, theta4\u20138, beta12\u201330Hz. No FFT, clinical interpretation or missing frequency extrapolation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
