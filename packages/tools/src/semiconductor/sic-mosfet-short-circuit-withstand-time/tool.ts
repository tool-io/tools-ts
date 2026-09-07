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
  aligned,
  binary,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedShortCircuitPulseDurationsSeconds: readonly number[];
  readonly observedWithstoodPulseFlags: readonly number[];
  readonly callerMatchedPulseTestConditionsVerified: boolean;
}>;
export type Output = Readonly<{
  readonly longestObservedWithstoodPulseSeconds: number;
  readonly shortestObservedFailedPulseSeconds: number;
  readonly bothOutcomeBoundsObserved: boolean;
}>;
const inputFields = [
  {
    id: "observedShortCircuitPulseDurationsSeconds",
    label: "Observed short circuit pulse durations seconds",
    kind: "numberList",
  },
  {
    id: "observedWithstoodPulseFlags",
    label: "Observed withstood pulse flags",
    kind: "numberList",
  },
  {
    id: "callerMatchedPulseTestConditionsVerified",
    label: "Caller matched pulse test conditions verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedShortCircuitPulseDurationsSeconds.forEach((v) =>
    positive(v, "observedShortCircuitPulseDurationsSeconds"),
  );
  binary(input.observedWithstoodPulseFlags, "observedWithstoodPulseFlags");
  aligned(
    input.observedShortCircuitPulseDurationsSeconds,
    input.observedWithstoodPulseFlags,
    "pulses",
  );
  if (!input.callerMatchedPulseTestConditionsVerified)
    simpleError(
      "conditions",
      "Independent same-condition test evidence required.",
    );
  const passed = input.observedShortCircuitPulseDurationsSeconds.filter(
      (_, i) => input.observedWithstoodPulseFlags[i],
    ),
    failed = input.observedShortCircuitPulseDurationsSeconds.filter(
      (_, i) => !input.observedWithstoodPulseFlags[i],
    );
  return {
    longestObservedWithstoodPulseSeconds: passed.length
      ? Math.max(...passed)
      : -1,
    shortestObservedFailedPulseSeconds: failed.length
      ? Math.min(...failed)
      : -1,
    bothOutcomeBoundsObserved: !!passed.length && !!failed.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedShortCircuitPulseDurationsSeconds: [1, 2, 3],
  observedWithstoodPulseFlags: [1, 1, 0],
  callerMatchedPulseTestConditionsVerified: true,
} satisfies Input;
export const exampleOutput = {
  longestObservedWithstoodPulseSeconds: 2,
  shortestObservedFailedPulseSeconds: 3,
  bothOutcomeBoundsObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/sic-mosfet-short-circuit-withstand-time",
  title: "Semiconductor Sic Mosfet Short Circuit Withstand Time Calculator",
  description:
    "Audit already observed SiC short-circuit withstand/failure bounds with unknown bound sentinel−1, no new destructive test, safe pulse limit or inferred manufacturer rating.",
  inputs: inputFields,
  outputs: [
    {
      id: "longestObservedWithstoodPulseSeconds",
      label: "Longest observed withstood pulse seconds",
      kind: "number",
    },
    {
      id: "shortestObservedFailedPulseSeconds",
      label: "Shortest observed failed pulse seconds",
      kind: "number",
    },
    {
      id: "bothOutcomeBoundsObserved",
      label: "Both outcome bounds observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedShortCircuitPulseDurationsSeconds:
        value.observedShortCircuitPulseDurationsSeconds as readonly number[],
      observedWithstoodPulseFlags:
        value.observedWithstoodPulseFlags as readonly number[],
      callerMatchedPulseTestConditionsVerified:
        value.callerMatchedPulseTestConditionsVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
