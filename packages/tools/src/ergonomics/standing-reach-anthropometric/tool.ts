import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedStandingReachCm: number;
  readonly independentPpeRestrictionCm: number;
  readonly callerRequiredReachCm: number;
}>;
export type Output = Readonly<{
  readonly conditionalAvailableReachCm: number;
  readonly signedReachReserveCm: number;
}>;
const inputFields = [
  {
    id: "observedStandingReachCm",
    label: "Observed standing reach cm",
    kind: "number",
  },
  {
    id: "independentPpeRestrictionCm",
    label: "Independent ppe restriction cm",
    kind: "number",
  },
  {
    id: "callerRequiredReachCm",
    label: "Caller required reach cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedStandingReachCm, "observedStandingReachCm");
  nonnegative(input.independentPpeRestrictionCm, "independentPpeRestrictionCm");
  nonnegative(input.callerRequiredReachCm, "callerRequiredReachCm");
  const r = nonnegative(
    input.observedStandingReachCm - input.independentPpeRestrictionCm,
    "available reach",
  );
  return {
    conditionalAvailableReachCm: r,
    signedReachReserveCm: r - input.callerRequiredReachCm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStandingReachCm: 70,
  independentPpeRestrictionCm: 5,
  callerRequiredReachCm: 60,
} satisfies Input;
export const exampleOutput = {
  conditionalAvailableReachCm: 65,
  signedReachReserveCm: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/standing-reach-anthropometric",
  title: "Standing Forward Reach Distance Anthropometric Calculator",
  description:
    "Actual functional standing reach with separately measured PPE restriction, not arm-length guess or unsafe forward reach advice. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalAvailableReachCm",
      label: "Conditional available reach cm",
      kind: "number",
    },
    {
      id: "signedReachReserveCm",
      label: "Signed reach reserve cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStandingReachCm: value.observedStandingReachCm as number,
      independentPpeRestrictionCm: value.independentPpeRestrictionCm as number,
      callerRequiredReachCm: value.callerRequiredReachCm as number,
    }),
});
export const run = tool.execute;
export default tool;
