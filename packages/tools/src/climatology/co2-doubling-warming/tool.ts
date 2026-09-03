import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerCo2DoublingForcingWPerM2: number;
  readonly callerNetRestoringFeedbackWPerM2K: number;
}>;
export type Output = Readonly<{
  readonly conditionalDoublingWarmingKelvin: number;
}>;
const inputFields = [
  {
    id: "callerCo2DoublingForcingWPerM2",
    label: "Caller co2 doubling forcing w per m2",
    kind: "number",
  },
  {
    id: "callerNetRestoringFeedbackWPerM2K",
    label: "Caller net restoring feedback w per m2 k",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerNetRestoringFeedbackWPerM2K,
    "callerNetRestoringFeedbackWPerM2K",
  );
  nonnegative(
    input.callerCo2DoublingForcingWPerM2,
    "callerCo2DoublingForcingWPerM2",
  );
  return {
    conditionalDoublingWarmingKelvin:
      input.callerCo2DoublingForcingWPerM2 /
      input.callerNetRestoringFeedbackWPerM2K,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCo2DoublingForcingWPerM2: 3.7,
  callerNetRestoringFeedbackWPerM2K: 1.85,
} satisfies Input;
export const exampleOutput = {
  conditionalDoublingWarmingKelvin: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/co2-doubling-warming",
  title: "CO2 Doubling Warming Estimate via Sensitivity Calculator",
  description:
    "Independently verified doubling forcing/net positive restoring feedback equilibrium warming—not log CO2 forcing calculation or transient response. Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalDoublingWarmingKelvin",
      label: "Conditional doubling warming kelvin",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCo2DoublingForcingWPerM2:
        value.callerCo2DoublingForcingWPerM2 as number,
      callerNetRestoringFeedbackWPerM2K:
        value.callerNetRestoringFeedbackWPerM2K as number,
    }),
});
export const run = tool.execute;
export default tool;
