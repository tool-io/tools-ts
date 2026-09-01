import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  catalogIndex,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerTrapAssemblyIds: readonly string[];
  readonly callerVerifiedMaxTrapArmLengthsM: readonly number[];
  readonly callerVerifiedMaxTrapArmFallsM: readonly number[];
  readonly queryTrapAssemblyId: string;
  readonly observedTrapArmLengthM: number;
  readonly observedTrapArmFallM: number;
}>;
export type Output = Readonly<{
  readonly signedCallerTrapLengthMarginM: number;
  readonly signedCallerTrapFallMarginM: number;
  readonly meetsBothCallerTrapArmLimits: boolean;
}>;
const inputFields = [
  {
    id: "callerTrapAssemblyIds",
    label: "Caller trap assembly ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMaxTrapArmLengthsM",
    label: "Caller verified max trap arm lengths m",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMaxTrapArmFallsM",
    label: "Caller verified max trap arm falls m",
    kind: "numberList",
  },
  {
    id: "queryTrapAssemblyId",
    label: "Query trap assembly id",
    kind: "string",
  },
  {
    id: "observedTrapArmLengthM",
    label: "Observed trap arm length m",
    kind: "number",
  },
  {
    id: "observedTrapArmFallM",
    label: "Observed trap arm fall m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedMaxTrapArmLengthsM.forEach((v) =>
    nonnegative(v, "callerVerifiedMaxTrapArmLengthsM"),
  );
  input.callerVerifiedMaxTrapArmFallsM.forEach((v) =>
    nonnegative(v, "callerVerifiedMaxTrapArmFallsM"),
  );
  nonnegative(input.observedTrapArmLengthM, "observedTrapArmLengthM");
  nonnegative(input.observedTrapArmFallM, "observedTrapArmFallM");
  aligned(
    input.callerTrapAssemblyIds,
    input.callerVerifiedMaxTrapArmLengthsM,
    "callerTrapAssemblyIds",
  );
  aligned(
    input.callerTrapAssemblyIds,
    input.callerVerifiedMaxTrapArmFallsM,
    "callerTrapAssemblyIds",
  );
  const i = catalogIndex(
      input.callerTrapAssemblyIds,
      input.queryTrapAssemblyId,
    ),
    length =
      input.callerVerifiedMaxTrapArmLengthsM[i] - input.observedTrapArmLengthM,
    fall = input.callerVerifiedMaxTrapArmFallsM[i] - input.observedTrapArmFallM;
  return {
    signedCallerTrapLengthMarginM: length,
    signedCallerTrapFallMarginM: fall,
    meetsBothCallerTrapArmLimits: length >= 0 && fall >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTrapAssemblyIds: ["a", "b"],
  callerVerifiedMaxTrapArmLengthsM: [1, 2],
  callerVerifiedMaxTrapArmFallsM: [0.05, 0.1],
  queryTrapAssemblyId: "a",
  observedTrapArmLengthM: 0.8,
  observedTrapArmFallM: 0.06,
} satisfies Input;
export const exampleOutput = {
  signedCallerTrapLengthMarginM: 0.2,
  signedCallerTrapFallMarginM: -0.01,
  meetsBothCallerTrapArmLimits: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/trap-arm-length",
  title: "Plumbing Trap Arm Length Calculator",
  description:
    "Audit actual trap-arm length and independently measured fall under verified assembly-specific limits; not generic slope calculation, universal code or trap-seal protection certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedCallerTrapLengthMarginM",
      label: "Signed caller trap length margin m",
      kind: "number",
    },
    {
      id: "signedCallerTrapFallMarginM",
      label: "Signed caller trap fall margin m",
      kind: "number",
    },
    {
      id: "meetsBothCallerTrapArmLimits",
      label: "Meets both caller trap arm limits",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTrapAssemblyIds: value.callerTrapAssemblyIds as readonly string[],
      callerVerifiedMaxTrapArmLengthsM:
        value.callerVerifiedMaxTrapArmLengthsM as readonly number[],
      callerVerifiedMaxTrapArmFallsM:
        value.callerVerifiedMaxTrapArmFallsM as readonly number[],
      queryTrapAssemblyId: value.queryTrapAssemblyId as string,
      observedTrapArmLengthM: value.observedTrapArmLengthM as number,
      observedTrapArmFallM: value.observedTrapArmFallM as number,
    }),
});
export const run = tool.execute;
export default tool;
