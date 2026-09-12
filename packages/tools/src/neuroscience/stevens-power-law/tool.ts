import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedModalityScale: number;
  readonly actualStimulusMagnitude: number;
  readonly callerCalibratedModalityExponent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedModalityScale",
    label: "Caller calibrated modality scale",
    kind: "number",
  },
  {
    id: "actualStimulusMagnitude",
    label: "Actual stimulus magnitude",
    kind: "number",
  },
  {
    id: "callerCalibratedModalityExponent",
    label: "Caller calibrated modality exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerCalibratedModalityScale,
    "callerCalibratedModalityScale",
  );
  positive(input.actualStimulusMagnitude, "actualStimulusMagnitude");
  return {
    value:
      input.callerCalibratedModalityScale *
      input.actualStimulusMagnitude ** input.callerCalibratedModalityExponent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedModalityScale: 1,
    actualStimulusMagnitude: 3,
    callerCalibratedModalityExponent: 2,
  },
  output: { result: { value: 9 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/stevens-power-law",
  title: "Stevens Power Law Calculator",
  description:
    "Conditional Stevens\u03a8=kI^a, independently calibrated positive stimulus/scale, finite exponent, one identified modality/context. No universal perceived intensity or coefficient invention. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
