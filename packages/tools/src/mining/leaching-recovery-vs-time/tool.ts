import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  curve,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedLeachTimesSeconds: readonly number[];
  readonly observedDissolvedMetalKg: readonly number[];
  readonly observedMatchedOriginalMetalKg: number;
  readonly callerQueryLeachTimeSeconds: number;
}>;
export type Output = Readonly<{
  readonly interpolatedObservedLeachRecoveryFraction: number;
  readonly observedLeachRecoveryDerivativePerSecond: number;
}>;
const inputFields = [
  {
    id: "observedLeachTimesSeconds",
    label: "Observed leach times seconds",
    kind: "numberList",
  },
  {
    id: "observedDissolvedMetalKg",
    label: "Observed dissolved metal kg",
    kind: "numberList",
  },
  {
    id: "observedMatchedOriginalMetalKg",
    label: "Observed matched original metal kg",
    kind: "number",
  },
  {
    id: "callerQueryLeachTimeSeconds",
    label: "Caller query leach time seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedMatchedOriginalMetalKg,
    "observedMatchedOriginalMetalKg",
  );
  input.observedLeachTimesSeconds.forEach((v) =>
    nonnegative(v, "observedLeachTimesSeconds"),
  );
  input.observedDissolvedMetalKg.forEach((v) =>
    nonnegative(v, "observedDissolvedMetalKg"),
  );
  nonnegative(input.callerQueryLeachTimeSeconds, "callerQueryLeachTimeSeconds");
  if (
    input.observedDissolvedMetalKg.some(
      (v) => v > input.observedMatchedOriginalMetalKg,
    )
  )
    simpleError("metal", "Measured dissolved≤original metal.");
  const v = curve(
    input.observedLeachTimesSeconds,
    input.observedDissolvedMetalKg.map(
      (v) => v / input.observedMatchedOriginalMetalKg,
    ),
    input.callerQueryLeachTimeSeconds,
  );
  return {
    interpolatedObservedLeachRecoveryFraction: v.value,
    observedLeachRecoveryDerivativePerSecond: v.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLeachTimesSeconds: [0, 1, 2],
  observedDissolvedMetalKg: [0, 1, 2],
  observedMatchedOriginalMetalKg: 4,
  callerQueryLeachTimeSeconds: 1.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedObservedLeachRecoveryFraction: 0.375,
  observedLeachRecoveryDerivativePerSecond: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/leaching-recovery-vs-time",
  title: "Leaching Recovery vs Time Calculator",
  description:
    "Read actual timed dissolved-metal assay recovery, not changing-solid-residue recovery or forward shrinking-core kinetics. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedObservedLeachRecoveryFraction",
      label: "Interpolated observed leach recovery fraction",
      kind: "number",
    },
    {
      id: "observedLeachRecoveryDerivativePerSecond",
      label: "Observed leach recovery derivative per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLeachTimesSeconds:
        value.observedLeachTimesSeconds as readonly number[],
      observedDissolvedMetalKg:
        value.observedDissolvedMetalKg as readonly number[],
      observedMatchedOriginalMetalKg:
        value.observedMatchedOriginalMetalKg as number,
      callerQueryLeachTimeSeconds: value.callerQueryLeachTimeSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
