import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  strictlyIncreasing,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualChannelCenterWavelengthsNm: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualChannelCenterWavelengthsNm",
    label: "Actual channel center wavelengths nm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  strictlyIncreasing(input.actualChannelCenterWavelengthsNm, "channels", 2);
  input.actualChannelCenterWavelengthsNm.forEach((v) =>
    positive(v, "wavelength"),
  );
  return {
    observedAdjacentChannelSpacingsNm: input.actualChannelCenterWavelengthsNm
      .slice(1)
      .map((v, i) => v - input.actualChannelCenterWavelengthsNm[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualChannelCenterWavelengthsNm: [1500, 1510, 1530] },
  output: { result: { observedAdjacentChannelSpacingsNm: [10, 20] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/arrayed-waveguide-grating-channel-spacing",
  title: "Semiconductor Arrayed Waveguide Grating Channel Spacing Calculator",
  description:
    "Actual ordered AWGchannel-center wavelength differences. Not free spectral range, frequency-equal spacing or a prescribed optical design.",
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
