import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  aligned,
  binary,
  unique,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly envelopeIds: readonly string[];
  readonly declaredEnvelopeAmountsMinor: readonly number[];
  readonly countedEnvelopeAmountsMinor: readonly number[];
  readonly countCompletedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedCountedMinusDeclaredByEnvelopeMinor: readonly number[];
  readonly countEvidenceAvailableFlags: readonly number[];
  readonly uncountedEnvelopeIds: readonly string[];
  readonly countedSubsetNetDifferenceMinor: number;
}>;
const inputFields = [
  { id: "envelopeIds", label: "Envelope ids", kind: "stringList" },
  {
    id: "declaredEnvelopeAmountsMinor",
    label: "Declared envelope amounts minor",
    kind: "numberList",
  },
  {
    id: "countedEnvelopeAmountsMinor",
    label: "Counted envelope amounts minor",
    kind: "numberList",
  },
  {
    id: "countCompletedFlags",
    label: "Count completed flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.declaredEnvelopeAmountsMinor.forEach((v) =>
    money(v, "declaredEnvelopeAmountsMinor"),
  );
  input.countedEnvelopeAmountsMinor.forEach((v) =>
    money(v, "countedEnvelopeAmountsMinor"),
  );
  binary(input.countCompletedFlags, "countCompletedFlags");
  aligned(input.envelopeIds, input.declaredEnvelopeAmountsMinor, "envelopeIds");
  aligned(input.envelopeIds, input.countedEnvelopeAmountsMinor, "envelopeIds");
  aligned(input.envelopeIds, input.countCompletedFlags, "envelopeIds");
  unique(input.envelopeIds, "envelopes");
  if (
    input.countedEnvelopeAmountsMinor.some(
      (v, i) => input.countCompletedFlags[i] === 0 && v !== 0,
    )
  )
    simpleError(
      "counts",
      "Uncounted envelope needs sentinel zero amount and evidence flag zero.",
    );
  const gaps = input.countedEnvelopeAmountsMinor.map((v, i) =>
    input.countCompletedFlags[i]
      ? integer(v - input.declaredEnvelopeAmountsMinor[i], "difference")
      : 0,
  );
  return {
    signedCountedMinusDeclaredByEnvelopeMinor: gaps,
    countEvidenceAvailableFlags: [...input.countCompletedFlags],
    uncountedEnvelopeIds: input.envelopeIds.filter(
      (_, i) => !input.countCompletedFlags[i],
    ),
    countedSubsetNetDifferenceMinor: signedSum(gaps),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  envelopeIds: ["A", "B"],
  declaredEnvelopeAmountsMinor: [100, 200],
  countedEnvelopeAmountsMinor: [90, 0],
  countCompletedFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedCountedMinusDeclaredByEnvelopeMinor: [-10, 0],
  countEvidenceAvailableFlags: [1, 0],
  uncountedEnvelopeIds: ["B"],
  countedSubsetNetDifferenceMinor: -10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/night-drop-envelope-reconcile-count",
  title: "Night Drop Envelope Reconcile Count Tool",
  description:
    "Reconcile actual night-drop declarations and completed counts by distinct envelope, retaining uncounted evidence rather than treating missing counts as zero cash; sentinel gaps require availability flags.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedCountedMinusDeclaredByEnvelopeMinor",
      label: "Signed counted minus declared by envelope minor",
      kind: "numberList",
    },
    {
      id: "countEvidenceAvailableFlags",
      label: "Count evidence available flags",
      kind: "numberList",
    },
    {
      id: "uncountedEnvelopeIds",
      label: "Uncounted envelope ids",
      kind: "stringList",
    },
    {
      id: "countedSubsetNetDifferenceMinor",
      label: "Counted subset net difference minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      envelopeIds: value.envelopeIds as readonly string[],
      declaredEnvelopeAmountsMinor:
        value.declaredEnvelopeAmountsMinor as readonly number[],
      countedEnvelopeAmountsMinor:
        value.countedEnvelopeAmountsMinor as readonly number[],
      countCompletedFlags: value.countCompletedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
