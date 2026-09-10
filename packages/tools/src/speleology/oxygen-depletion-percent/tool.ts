import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentReferenceOxygenPercentByVolume: number;
  readonly actualCalibratedOxygenPercentByVolume: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentReferenceOxygenPercentByVolume",
    label: "Caller independent reference oxygen percent by volume",
    kind: "number",
  },
  {
    id: "actualCalibratedOxygenPercentByVolume",
    label: "Actual calibrated oxygen percent by volume",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerIndependentReferenceOxygenPercentByVolume, "first");
  nonnegative(input.actualCalibratedOxygenPercentByVolume, "second");
  return {
    signedObservedDifference:
      input.callerIndependentReferenceOxygenPercentByVolume -
      input.actualCalibratedOxygenPercentByVolume,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentReferenceOxygenPercentByVolume: 5,
    actualCalibratedOxygenPercentByVolume: 3,
  },
  output: { result: { signedObservedDifference: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/oxygen-depletion-percent",
  title: "Oxygen Depletion Percent Calculator",
  description:
    "Signed oxygen percentage-POINTdepletion versus independently established reference, no depth-based atmospheric prediction. Actual independently matched units, contexts and definitions; signed differences retained, not a validated risk or safety claim.",
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
