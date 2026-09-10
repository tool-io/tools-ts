import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyIdentifiedHalfMaximumWavelengthsNm: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyIdentifiedHalfMaximumWavelengthsNm",
    label: "Actual independently identified half maximum wavelengths nm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.actualIndependentlyIdentifiedHalfMaximumWavelengthsNm.length !== 2 ||
    input.actualIndependentlyIdentifiedHalfMaximumWavelengthsNm[0] <= 0 ||
    input.actualIndependentlyIdentifiedHalfMaximumWavelengthsNm[1] <
      input.actualIndependentlyIdentifiedHalfMaximumWavelengthsNm[0]
  )
    simpleError(
      "band",
      "Exactly two qualified ordered positive wavelength boundaries.",
    );
  return {
    observedHalfMaximumBandwidthNm:
      input.actualIndependentlyIdentifiedHalfMaximumWavelengthsNm[1] -
      input.actualIndependentlyIdentifiedHalfMaximumWavelengthsNm[0],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyIdentifiedHalfMaximumWavelengthsNm: [1500, 1540],
  },
  output: { result: { observedHalfMaximumBandwidthNm: 40 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/grating-coupler-bandwidth",
  title: "Semiconductor Grating Coupler Bandwidth Calculator",
  description:
    "Actual independently identified grating-coupler contiguous half-maximum spectral interval width, not numerical peak finding, guaranteed passband or arbitrary throughput limits.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
