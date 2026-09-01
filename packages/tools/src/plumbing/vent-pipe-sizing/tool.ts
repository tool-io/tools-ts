import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerVentPipeIds: readonly string[];
  readonly callerVerifiedVentAllowableFixtureUnits: readonly number[];
  readonly callerVerifiedVentAllowableLengthsM: readonly number[];
  readonly observedVentServedFixtureUnits: number;
  readonly observedVentDevelopedLengthM: number;
}>;
export type Output = Readonly<{
  readonly callerCompatibleVentPipeIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerVentPipeIds",
    label: "Caller vent pipe ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedVentAllowableFixtureUnits",
    label: "Caller verified vent allowable fixture units",
    kind: "numberList",
  },
  {
    id: "callerVerifiedVentAllowableLengthsM",
    label: "Caller verified vent allowable lengths m",
    kind: "numberList",
  },
  {
    id: "observedVentServedFixtureUnits",
    label: "Observed vent served fixture units",
    kind: "number",
  },
  {
    id: "observedVentDevelopedLengthM",
    label: "Observed vent developed length m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedVentAllowableFixtureUnits.forEach((v) =>
    nonnegative(v, "callerVerifiedVentAllowableFixtureUnits"),
  );
  input.callerVerifiedVentAllowableLengthsM.forEach((v) =>
    nonnegative(v, "callerVerifiedVentAllowableLengthsM"),
  );
  nonnegative(
    input.observedVentServedFixtureUnits,
    "observedVentServedFixtureUnits",
  );
  nonnegative(
    input.observedVentDevelopedLengthM,
    "observedVentDevelopedLengthM",
  );
  aligned(
    input.callerVentPipeIds,
    input.callerVerifiedVentAllowableFixtureUnits,
    "callerVentPipeIds",
  );
  aligned(
    input.callerVentPipeIds,
    input.callerVerifiedVentAllowableLengthsM,
    "callerVentPipeIds",
  );
  unique(input.callerVentPipeIds, "vents");
  return {
    callerCompatibleVentPipeIds: input.callerVentPipeIds.filter(
      (_, i) =>
        input.callerVerifiedVentAllowableFixtureUnits[i] >=
          input.observedVentServedFixtureUnits &&
        input.callerVerifiedVentAllowableLengthsM[i] >=
          input.observedVentDevelopedLengthM,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVentPipeIds: ["a", "b"],
  callerVerifiedVentAllowableFixtureUnits: [5, 15],
  callerVerifiedVentAllowableLengthsM: [10, 20],
  observedVentServedFixtureUnits: 8,
  observedVentDevelopedLengthM: 12,
} satisfies Input;
export const exampleOutput = {
  callerCompatibleVentPipeIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/vent-pipe-sizing",
  title: "Plumbing Vent Pipe Sizing Calculator",
  description:
    "Audit actual vent developed length plus independent served fixture-unit capacity under caller verified vent catalog, not scalar capacity alone or inferred sanitation/building code.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCompatibleVentPipeIds",
      label: "Caller compatible vent pipe ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVentPipeIds: value.callerVentPipeIds as readonly string[],
      callerVerifiedVentAllowableFixtureUnits:
        value.callerVerifiedVentAllowableFixtureUnits as readonly number[],
      callerVerifiedVentAllowableLengthsM:
        value.callerVerifiedVentAllowableLengthsM as readonly number[],
      observedVentServedFixtureUnits:
        value.observedVentServedFixtureUnits as number,
      observedVentDevelopedLengthM:
        value.observedVentDevelopedLengthM as number,
    }),
});
export const run = tool.execute;
export default tool;
