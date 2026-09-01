import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  catalogIndex,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerBonusStepIds: readonly string[];
  readonly callerUnprotectedClaimNextStepIds: readonly string[];
  readonly callerProtectedClaimNextStepIds: readonly string[];
  readonly observedCurrentBonusStepId: string;
  readonly callerProtectionEndorsementVerified: boolean;
}>;
export type Output = Readonly<{
  readonly callerClaimNextBonusStepId: string;
  readonly callerUnprotectedNextBonusStepId: string;
}>;
const inputFields = [
  {
    id: "callerBonusStepIds",
    label: "Caller bonus step ids",
    kind: "stringList",
  },
  {
    id: "callerUnprotectedClaimNextStepIds",
    label: "Caller unprotected claim next step ids",
    kind: "stringList",
  },
  {
    id: "callerProtectedClaimNextStepIds",
    label: "Caller protected claim next step ids",
    kind: "stringList",
  },
  {
    id: "observedCurrentBonusStepId",
    label: "Observed current bonus step id",
    kind: "string",
  },
  {
    id: "callerProtectionEndorsementVerified",
    label: "Caller protection endorsement verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerBonusStepIds,
    input.callerUnprotectedClaimNextStepIds,
    "steps",
  );
  aligned(
    input.callerBonusStepIds,
    input.callerProtectedClaimNextStepIds,
    "steps",
  );
  unique(input.callerBonusStepIds, "steps");
  [
    ...input.callerUnprotectedClaimNextStepIds,
    ...input.callerProtectedClaimNextStepIds,
  ].forEach((v) => catalogIndex(input.callerBonusStepIds, v));
  const i = catalogIndex(
    input.callerBonusStepIds,
    input.observedCurrentBonusStepId,
  );
  return {
    callerClaimNextBonusStepId: (input.callerProtectionEndorsementVerified
      ? input.callerProtectedClaimNextStepIds
      : input.callerUnprotectedClaimNextStepIds)[i],
    callerUnprotectedNextBonusStepId:
      input.callerUnprotectedClaimNextStepIds[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBonusStepIds: ["a", "b", "c"],
  callerUnprotectedClaimNextStepIds: ["b", "c", "c"],
  callerProtectedClaimNextStepIds: ["a", "b", "c"],
  observedCurrentBonusStepId: "b",
  callerProtectionEndorsementVerified: true,
} satisfies Input;
export const exampleOutput = {
  callerClaimNextBonusStepId: "b",
  callerUnprotectedNextBonusStepId: "c",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/no-claims-bonus-protection-step-lookup",
  title: "No Claims Bonus Protection Step Lookup",
  description:
    "Read actual current no-claims bonus through caller verified protected/unprotected claim transition maps; not inferred step count, premium protection or universal insurer rules.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerClaimNextBonusStepId",
      label: "Caller claim next bonus step id",
      kind: "string",
    },
    {
      id: "callerUnprotectedNextBonusStepId",
      label: "Caller unprotected next bonus step id",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBonusStepIds: value.callerBonusStepIds as readonly string[],
      callerUnprotectedClaimNextStepIds:
        value.callerUnprotectedClaimNextStepIds as readonly string[],
      callerProtectedClaimNextStepIds:
        value.callerProtectedClaimNextStepIds as readonly string[],
      observedCurrentBonusStepId: value.observedCurrentBonusStepId as string,
      callerProtectionEndorsementVerified:
        value.callerProtectionEndorsementVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
