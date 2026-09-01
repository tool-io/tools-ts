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
  bounded,
  aligned,
  binary,
  safeText,
  sumMoney,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedEventA: readonly number[];
  readonly callerVerifiedEventB: readonly number[];
  readonly callerVerifiedEventC: readonly number[];
  readonly callerTrackEventFlags: readonly number[];
  readonly observedResultsInCallerTableUnits: readonly number[];
  readonly callerScoringEditionId: string;
}>;
export type Output = Readonly<{
  readonly callerScoredEventPoints: readonly number[];
  readonly callerCombinedEventPoints: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedEventA",
    label: "Caller verified event a",
    kind: "numberList",
  },
  {
    id: "callerVerifiedEventB",
    label: "Caller verified event b",
    kind: "numberList",
  },
  {
    id: "callerVerifiedEventC",
    label: "Caller verified event c",
    kind: "numberList",
  },
  {
    id: "callerTrackEventFlags",
    label: "Caller track event flags",
    kind: "numberList",
  },
  {
    id: "observedResultsInCallerTableUnits",
    label: "Observed results in caller table units",
    kind: "numberList",
  },
  {
    id: "callerScoringEditionId",
    label: "Caller scoring edition id",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.observedResultsInCallerTableUnits.length !== 10)
    simpleError(
      "events",
      "Exactly 10 independently observed event results required.",
    );
  aligned(
    input.callerVerifiedEventA,
    input.observedResultsInCallerTableUnits,
    "events",
  );
  aligned(
    input.callerVerifiedEventB,
    input.observedResultsInCallerTableUnits,
    "events",
  );
  aligned(
    input.callerVerifiedEventC,
    input.observedResultsInCallerTableUnits,
    "events",
  );
  aligned(
    input.callerTrackEventFlags,
    input.observedResultsInCallerTableUnits,
    "events",
  );
  binary(input.callerTrackEventFlags, "track");
  safeText(input.callerScoringEditionId, "edition");
  input.callerVerifiedEventA.forEach((v) => positive(v, "A"));
  input.callerVerifiedEventC.forEach((v) => positive(v, "C"));
  input.observedResultsInCallerTableUnits.forEach((v) =>
    nonnegative(v, "result"),
  );
  const points = input.observedResultsInCallerTableUnits.map((v, i) =>
    bounded(
      Math.floor(
        input.callerVerifiedEventA[i] *
          Math.pow(
            Math.max(
              0,
              input.callerTrackEventFlags[i]
                ? input.callerVerifiedEventB[i] - v
                : v - input.callerVerifiedEventB[i],
            ),
            input.callerVerifiedEventC[i],
          ),
      ),
      "points",
      0,
      10000000,
    ),
  );
  return {
    callerScoredEventPoints: points,
    callerCombinedEventPoints: sumMoney(points),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedEventA: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  callerVerifiedEventB: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  callerVerifiedEventC: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  callerTrackEventFlags: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  observedResultsInCallerTableUnits: [9, 12, 12, 12, 12, 12, 12, 12, 12, 12],
  callerScoringEditionId: "verified-edition",
} satisfies Input;
export const exampleOutput = {
  callerScoredEventPoints: [1, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  callerCombinedEventPoints: 37,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/decathlon-points-table-iaaf-lookup",
  title: "Decathlon Points Table Lookup",
  description:
    "Apply caller verified decathlon scoring edition A/B/C with explicit track/field orientation and result units, floor per event; no fabricated IAAF table, mixed units or official meet certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerScoredEventPoints",
      label: "Caller scored event points",
      kind: "numberList",
    },
    {
      id: "callerCombinedEventPoints",
      label: "Caller combined event points",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedEventA: value.callerVerifiedEventA as readonly number[],
      callerVerifiedEventB: value.callerVerifiedEventB as readonly number[],
      callerVerifiedEventC: value.callerVerifiedEventC as readonly number[],
      callerTrackEventFlags: value.callerTrackEventFlags as readonly number[],
      observedResultsInCallerTableUnits:
        value.observedResultsInCallerTableUnits as readonly number[],
      callerScoringEditionId: value.callerScoringEditionId as string,
    }),
});
export const run = tool.execute;
export default tool;
