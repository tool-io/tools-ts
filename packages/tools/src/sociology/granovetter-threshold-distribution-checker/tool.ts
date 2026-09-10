import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  aligned,
  unique,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerParticipantIds: readonly string[];
  readonly independentlyEstablishedParticipationThresholds: readonly number[];
  readonly initialParticipantIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerParticipantIds",
    label: "Caller participant ids",
    kind: "stringList",
  },
  {
    id: "independentlyEstablishedParticipationThresholds",
    label: "Independently established participation thresholds",
    kind: "numberList",
  },
  {
    id: "initialParticipantIds",
    label: "Initial participant ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerParticipantIds, "participants");
  aligned(
    input.callerParticipantIds,
    input.independentlyEstablishedParticipationThresholds,
    "thresholds",
  );
  input.independentlyEstablishedParticipationThresholds.forEach((v) =>
    bounded(v, "threshold", 0, input.callerParticipantIds.length),
  );
  if (
    new Set(input.initialParticipantIds).size !==
      input.initialParticipantIds.length ||
    input.initialParticipantIds.some(
      (v) => !input.callerParticipantIds.includes(v),
    )
  )
    simpleError("initial", "Distinct initial IDs from actual participants.");
  const active = new Set(input.initialParticipantIds),
    newIds: string[] = [],
    rounds: number[] = [];
  for (let r = 1; r <= input.callerParticipantIds.length; r++) {
    const next = input.callerParticipantIds.filter(
      (v, i) =>
        !active.has(v) &&
        active.size >= input.independentlyEstablishedParticipationThresholds[i],
    );
    if (!next.length) break;
    next.forEach((v) => {
      active.add(v);
      newIds.push(v);
      rounds.push(r);
    });
  }
  return {
    conditionalParticipantIds: input.callerParticipantIds.filter((v) =>
      active.has(v),
    ),
    newParticipantIdsByRound: newIds,
    newParticipantRoundIndices: rounds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerParticipantIds: ["a", "b", "c"],
    independentlyEstablishedParticipationThresholds: [0, 1, 2],
    initialParticipantIds: [],
  },
  output: {
    result: {
      conditionalParticipantIds: ["a", "b", "c"],
      newParticipantIdsByRound: ["a", "b", "c"],
      newParticipantRoundIndices: [1, 2, 3],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/granovetter-threshold-distribution-checker",
  title: "Granovetter Threshold Distribution Checker",
  description:
    "Conditional synchronous Granovetter count-threshold cascade with explicit distinct participants and calibrated thresholds. All new participation uses prior-round count; no behavior prediction, coercion or universal threshold distribution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
