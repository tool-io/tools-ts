import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerIndependentNoWakeGenerationKwh: readonly number[];
  readonly observedWakeAffectedGenerationKwh: readonly number[];
  readonly knownMatchedGenerationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownMatchedWakeLossFraction: number;
  readonly unassessedReferenceGenerationKwh: number;
}>;
const inputFields = [
  {
    id: "callerIndependentNoWakeGenerationKwh",
    label: "Caller independent no wake generation kwh",
    kind: "numberList",
  },
  {
    id: "observedWakeAffectedGenerationKwh",
    label: "Observed wake affected generation kwh",
    kind: "numberList",
  },
  {
    id: "knownMatchedGenerationFlags",
    label: "Known matched generation flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerIndependentNoWakeGenerationKwh.forEach((v) =>
    nonnegative(v, "callerIndependentNoWakeGenerationKwh"),
  );
  input.observedWakeAffectedGenerationKwh.forEach((v) =>
    nonnegative(v, "observedWakeAffectedGenerationKwh"),
  );
  binary(input.knownMatchedGenerationFlags, "knownMatchedGenerationFlags");
  aligned(
    input.callerIndependentNoWakeGenerationKwh,
    input.observedWakeAffectedGenerationKwh,
    "callerIndependentNoWakeGenerationKwh",
  );
  aligned(
    input.callerIndependentNoWakeGenerationKwh,
    input.knownMatchedGenerationFlags,
    "callerIndependentNoWakeGenerationKwh",
  );
  const base = sum(
    input.callerIndependentNoWakeGenerationKwh.filter(
      (_, i) => input.knownMatchedGenerationFlags[i],
    ),
  );
  positive(base, "known independent reference");
  return {
    knownMatchedWakeLossFraction:
      1 -
      sum(
        input.observedWakeAffectedGenerationKwh.filter(
          (_, i) => input.knownMatchedGenerationFlags[i],
        ),
      ) /
        base,
    unassessedReferenceGenerationKwh: sum(
      input.callerIndependentNoWakeGenerationKwh.filter(
        (_, i) => !input.knownMatchedGenerationFlags[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentNoWakeGenerationKwh: [100, 200],
  observedWakeAffectedGenerationKwh: [80, 150],
  knownMatchedGenerationFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownMatchedWakeLossFraction: 0.2,
  unassessedReferenceGenerationKwh: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/wind-farm-wake-loss",
  title: "Wind Farm Wake Loss Calculator",
  description:
    "Audit independently matched no-wake/observed generation with unavailable references, negative apparent wake loss preserved; no causal wake attribution or Jensen model. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownMatchedWakeLossFraction",
      label: "Known matched wake loss fraction",
      kind: "number",
    },
    {
      id: "unassessedReferenceGenerationKwh",
      label: "Unassessed reference generation kwh",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentNoWakeGenerationKwh:
        value.callerIndependentNoWakeGenerationKwh as readonly number[],
      observedWakeAffectedGenerationKwh:
        value.observedWakeAffectedGenerationKwh as readonly number[],
      knownMatchedGenerationFlags:
        value.knownMatchedGenerationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
