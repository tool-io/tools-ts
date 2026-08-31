import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  unique,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerFastenerIds: readonly string[];
  readonly observedOpenCloseCycleSeconds: readonly number[];
  readonly independentlyVerifiedRetentionFlags: readonly number[];
  readonly callerAvailableFastenerSeconds: number;
}>;
export type Output = Readonly<{
  readonly callerFeasibleFastenerIds: readonly string[];
  readonly fastenersOverCallerTimeBudget: readonly string[];
  readonly fastenersWithoutVerifiedRetention: readonly string[];
}>;
const inputFields = [
  { id: "callerFastenerIds", label: "Caller fastener ids", kind: "stringList" },
  {
    id: "observedOpenCloseCycleSeconds",
    label: "Observed open close cycle seconds",
    kind: "numberList",
  },
  {
    id: "independentlyVerifiedRetentionFlags",
    label: "Independently verified retention flags",
    kind: "numberList",
  },
  {
    id: "callerAvailableFastenerSeconds",
    label: "Caller available fastener seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOpenCloseCycleSeconds.forEach((v) =>
    nonnegative(v, "observedOpenCloseCycleSeconds"),
  );
  nonnegative(
    input.callerAvailableFastenerSeconds,
    "callerAvailableFastenerSeconds",
  );
  binary(
    input.independentlyVerifiedRetentionFlags,
    "independentlyVerifiedRetentionFlags",
  );
  aligned(
    input.callerFastenerIds,
    input.observedOpenCloseCycleSeconds,
    "callerFastenerIds",
  );
  aligned(
    input.callerFastenerIds,
    input.independentlyVerifiedRetentionFlags,
    "callerFastenerIds",
  );
  unique(input.callerFastenerIds, "fasteners");
  return {
    callerFeasibleFastenerIds: input.callerFastenerIds.filter(
      (_, i) =>
        input.observedOpenCloseCycleSeconds[i] <=
          input.callerAvailableFastenerSeconds &&
        input.independentlyVerifiedRetentionFlags[i] === 1,
    ),
    fastenersOverCallerTimeBudget: input.callerFastenerIds.filter(
      (_, i) =>
        input.observedOpenCloseCycleSeconds[i] >
        input.callerAvailableFastenerSeconds,
    ),
    fastenersWithoutVerifiedRetention: input.callerFastenerIds.filter(
      (_, i) => !input.independentlyVerifiedRetentionFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFastenerIds: ["magnet", "hook-loop"],
  observedOpenCloseCycleSeconds: [2, 4],
  independentlyVerifiedRetentionFlags: [0, 1],
  callerAvailableFastenerSeconds: 3,
} satisfies Input;
export const exampleOutput = {
  callerFeasibleFastenerIds: [],
  fastenersOverCallerTimeBudget: ["hook-loop"],
  fastenersWithoutVerifiedRetention: ["magnet"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/quick-change-fastener-magnet-velcro-choice-lookup",
  title: "Quick Change Fastener Magnet Velcro Choice Lookup",
  description:
    "Screen actual timed costume fastener candidates with separate verified retention evidence; no universal magnet/Velcro superiority, adhesive/sewing guidance or device/magnet safety clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerFeasibleFastenerIds",
      label: "Caller feasible fastener ids",
      kind: "stringList",
    },
    {
      id: "fastenersOverCallerTimeBudget",
      label: "Fasteners over caller time budget",
      kind: "stringList",
    },
    {
      id: "fastenersWithoutVerifiedRetention",
      label: "Fasteners without verified retention",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFastenerIds: value.callerFastenerIds as readonly string[],
      observedOpenCloseCycleSeconds:
        value.observedOpenCloseCycleSeconds as readonly number[],
      independentlyVerifiedRetentionFlags:
        value.independentlyVerifiedRetentionFlags as readonly number[],
      callerAvailableFastenerSeconds:
        value.callerAvailableFastenerSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
