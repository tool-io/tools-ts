import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  monotone,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedDescendingSupplyVoltagesV: readonly number[];
  readonly latchedStateEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly lastObservedLatchedSupplyV: number;
  readonly firstObservedReleasedSupplyV: number;
  readonly holdingVoltageBracketV: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDescendingSupplyVoltagesV",
    label: "Observed descending supply voltages v",
    kind: "numberList",
  },
  {
    id: "latchedStateEvidenceFlags",
    label: "Latched state evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDescendingSupplyVoltagesV.forEach((v) =>
    nonnegative(v, "observedDescendingSupplyVoltagesV"),
  );
  binary(input.latchedStateEvidenceFlags, "latchedStateEvidenceFlags");
  aligned(
    input.observedDescendingSupplyVoltagesV,
    input.latchedStateEvidenceFlags,
    "observedDescendingSupplyVoltagesV",
  );
  monotone(input.observedDescendingSupplyVoltagesV, "down", "voltage");
  const release = input.latchedStateEvidenceFlags.indexOf(0);
  if (
    release <= 0 ||
    input.latchedStateEvidenceFlags.slice(release).some((v) => v === 1)
  )
    simpleError(
      "states",
      "One observed latched-to-released transition on descending sweep required; otherwise holding voltage censored/ambiguous.",
    );
  const hi = input.observedDescendingSupplyVoltagesV[release - 1],
    lo = input.observedDescendingSupplyVoltagesV[release];
  return {
    lastObservedLatchedSupplyV: hi,
    firstObservedReleasedSupplyV: lo,
    holdingVoltageBracketV: [lo, hi],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDescendingSupplyVoltagesV: [5, 4, 3, 2],
  latchedStateEvidenceFlags: [1, 1, 0, 0],
} satisfies Input;
export const exampleOutput = {
  lastObservedLatchedSupplyV: 4,
  firstObservedReleasedSupplyV: 3,
  holdingVoltageBracketV: [3, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/latchup-holding-voltage",
  title: "Latchup Holding Voltage Calculator",
  description:
    "Bracket observed latchup holding voltage from actual descending supply/state evidence instead of inventing sub-sample threshold; not a destructive test procedure or chip immunity certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "lastObservedLatchedSupplyV",
      label: "Last observed latched supply v",
      kind: "number",
    },
    {
      id: "firstObservedReleasedSupplyV",
      label: "First observed released supply v",
      kind: "number",
    },
    {
      id: "holdingVoltageBracketV",
      label: "Holding voltage bracket v",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDescendingSupplyVoltagesV:
        value.observedDescendingSupplyVoltagesV as readonly number[],
      latchedStateEvidenceFlags:
        value.latchedStateEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
