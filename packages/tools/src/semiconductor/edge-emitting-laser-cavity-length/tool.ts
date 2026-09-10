import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualLongitudinalModeFrequencySpacingHz: number;
  readonly independentlyEstablishedGroupIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLongitudinalModeFrequencySpacingHz",
    label: "Actual longitudinal mode frequency spacing hz",
    kind: "number",
  },
  {
    id: "independentlyEstablishedGroupIndex",
    label: "Independently established group index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualLongitudinalModeFrequencySpacingHz, "spacing");
  positive(input.independentlyEstablishedGroupIndex, "groupindex");
  return {
    conditionalFabryPerotCavityLengthMeters:
      299792458 /
      (2 *
        input.independentlyEstablishedGroupIndex *
        input.actualLongitudinalModeFrequencySpacingHz),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualLongitudinalModeFrequencySpacingHz: 100000000000.0,
    independentlyEstablishedGroupIndex: 3,
  },
  output: {
    result: { conditionalFabryPerotCavityLengthMeters: 0.0004996540966666666 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/edge-emitting-laser-cavity-length",
  title: "Semiconductor Edge Emitting Laser Cavity Length Calculator",
  description:
    "Ideal Fabry\u2013Perotedge-emitter length c/(2ng\u0394\u03bd) from independently identified adjacent longitudinal-mode frequencies and actual group index. Not infer physical cavity length from wavelength interval without conversion or use phase index.",
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
