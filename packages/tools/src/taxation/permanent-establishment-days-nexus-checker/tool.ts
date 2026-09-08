import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  integer,
  aligned,
  finite,
  ordered,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedPresenceStartDayOffsets: readonly number[];
  readonly observedPresenceEndDayOffsetsExclusive: readonly number[];
  readonly callerApplicableNexusDayThreshold: number;
}>;
export type Output = Readonly<{
  readonly uniqueObservedPresenceDays: number;
  readonly signedDayThresholdExcess: number;
}>;
const inputFields = [
  {
    id: "observedPresenceStartDayOffsets",
    label: "Observed presence start day offsets",
    kind: "numberList",
  },
  {
    id: "observedPresenceEndDayOffsetsExclusive",
    label: "Observed presence end day offsets exclusive",
    kind: "numberList",
  },
  {
    id: "callerApplicableNexusDayThreshold",
    label: "Caller applicable nexus day threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedPresenceStartDayOffsets,
    input.observedPresenceEndDayOffsetsExclusive,
    "presence intervals",
  );
  if (input.observedPresenceStartDayOffsets.length > 128)
    simpleError("intervals", "≤128presence intervals.");
  const intervals = input.observedPresenceStartDayOffsets
    .map((a, i) => {
      integer(a, "start");
      integer(input.observedPresenceEndDayOffsetsExclusive[i], "end");
      ordered(a, input.observedPresenceEndDayOffsetsExclusive[i]);
      return [a, input.observedPresenceEndDayOffsetsExclusive[i]];
    })
    .sort((a, b) => a[0] - b[0]);
  bounded(input.callerApplicableNexusDayThreshold, "threshold", 1, 100000);
  let total = 0,
    start = intervals[0][0],
    end = intervals[0][1];
  for (const [a, b] of intervals.slice(1)) {
    if (a <= end) end = Math.max(end, b);
    else {
      total = finite(total + end - start);
      start = a;
      end = b;
    }
  }
  total = finite(total + end - start);
  integer(total, "days");
  return {
    uniqueObservedPresenceDays: total,
    signedDayThresholdExcess: total - input.callerApplicableNexusDayThreshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPresenceStartDayOffsets: [0, 5],
  observedPresenceEndDayOffsetsExclusive: [10, 15],
  callerApplicableNexusDayThreshold: 12,
} satisfies Input;
export const exampleOutput = {
  uniqueObservedPresenceDays: 15,
  signedDayThresholdExcess: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/permanent-establishment-days-nexus-checker",
  title: "Permanent Establishment Days Nexus Checker",
  description:
    "Union actual half-open presence-day intervals with overlaps deduplicated, explicit treaty PE day threshold only; business/control/fixed-place facts external. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "uniqueObservedPresenceDays",
      label: "Unique observed presence days",
      kind: "number",
    },
    {
      id: "signedDayThresholdExcess",
      label: "Signed day threshold excess",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPresenceStartDayOffsets:
        value.observedPresenceStartDayOffsets as readonly number[],
      observedPresenceEndDayOffsetsExclusive:
        value.observedPresenceEndDayOffsetsExclusive as readonly number[],
      callerApplicableNexusDayThreshold:
        value.callerApplicableNexusDayThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
