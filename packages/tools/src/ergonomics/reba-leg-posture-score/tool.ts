import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly bilateralStableSupport: boolean;
  readonly kneeFlexionDegrees: number;
  readonly observedSeated: boolean;
}>;
export type Output = Readonly<{ readonly rebaLegScore: number }>;
const inputFields = [
  {
    id: "bilateralStableSupport",
    label: "Bilateral stable support",
    kind: "boolean",
  },
  { id: "kneeFlexionDegrees", label: "Knee flexion degrees", kind: "number" },
  { id: "observedSeated", label: "Observed seated posture", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.kneeFlexionDegrees < 0 || input.kneeFlexionDegrees > 180)
    simpleError("knee", "0..180 degrees.");
  return {
    rebaLegScore:
      (input.bilateralStableSupport ? 1 : 2) +
      (input.observedSeated
        ? 0
        : input.kneeFlexionDegrees > 60
          ? 2
          : input.kneeFlexionDegrees > 30
            ? 1
            : 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bilateralStableSupport: true,
  kneeFlexionDegrees: 45,
  observedSeated: false,
} satisfies Input;
export const exampleOutput = { rebaLegScore: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/reba-leg-posture-score",
  title: "REBA Leg Posture Score Calculator",
  description:
    "REBA leg component support 1/2 plus nonseated knee bend beyond 30 through 60 degrees +1 or beyond 60 degrees +2; explicitly seated observations omit knee-bend additions. Not total risk score or work-safety approval; caller independently establishes posture evidence and protocol applicability.",
  inputs: inputFields,
  outputs: [{ id: "rebaLegScore", label: "Reba leg score", kind: "number" }],
  calculate: (value) =>
    calculate({
      bilateralStableSupport: value.bilateralStableSupport as boolean,
      kneeFlexionDegrees: value.kneeFlexionDegrees as number,
      observedSeated: value.observedSeated as boolean,
    }),
});
export const run = tool.execute;
export default tool;
