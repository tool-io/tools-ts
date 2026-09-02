import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, wrap } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly orientedSynodicElongationDegrees: number;
  readonly callerSynodicPeriodDays: number;
}>;
export type Output = Readonly<{ readonly uniformPhaseAgeDays: number }>;
const inputFields = [
  {
    id: "orientedSynodicElongationDegrees",
    label: "Oriented synodic elongation degrees",
    kind: "number",
  },
  {
    id: "callerSynodicPeriodDays",
    label: "Caller synodic period days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerSynodicPeriodDays, "callerSynodicPeriodDays");
  return {
    uniformPhaseAgeDays:
      (wrap(input.orientedSynodicElongationDegrees, 360) / 360) *
      input.callerSynodicPeriodDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  orientedSynodicElongationDegrees: 180,
  callerSynodicPeriodDays: 29.530588853,
} satisfies Input;
export const exampleOutput = {
  uniformPhaseAgeDays: 14.7652944265,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/moon-age-days-from-elongation",
  title: "Moon Age Days From Elongation",
  description:
    "Uniform synodic phase-clock age from ORIENTED 0..360 elongation and independent period; sky separation 0..180 alone cannot distinguish waxing/waning. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "uniformPhaseAgeDays",
      label: "Uniform phase age days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      orientedSynodicElongationDegrees:
        value.orientedSynodicElongationDegrees as number,
      callerSynodicPeriodDays: value.callerSynodicPeriodDays as number,
    }),
});
export const run = tool.execute;
export default tool;
