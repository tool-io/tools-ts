import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, binary } from "../shared.js";
export type Input = Readonly<{
  readonly requiredCriterionFlags: readonly number[];
  readonly documentedCriterionFlags: readonly number[];
  readonly callerBlockingCriterionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly missingRequiredCriterionIndices: readonly number[];
  readonly missingBlockingCriterionIndices: readonly number[];
  readonly requiredDocumentationComplete: boolean;
}>;
const inputFields = [
  {
    id: "requiredCriterionFlags",
    label: "Required criterion flags",
    kind: "numberList",
  },
  {
    id: "documentedCriterionFlags",
    label: "Documented criterion flags",
    kind: "numberList",
  },
  {
    id: "callerBlockingCriterionFlags",
    label: "Caller blocking criterion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.requiredCriterionFlags,
    input.documentedCriterionFlags,
    "criteria",
  );
  aligned(
    input.requiredCriterionFlags,
    input.callerBlockingCriterionFlags,
    "criteria",
  );
  binary(input.requiredCriterionFlags, "required");
  binary(input.documentedCriterionFlags, "documented");
  binary(input.callerBlockingCriterionFlags, "blocking");
  if (
    !input.requiredCriterionFlags.some((v) => v === 1) ||
    input.callerBlockingCriterionFlags.some(
      (v, i) => v > input.requiredCriterionFlags[i],
    )
  )
    simpleError(
      "criteria",
      "Nonempty required criteria and blocking subset required.",
    );
  const missing = input.requiredCriterionFlags.flatMap((v, i) =>
    v && !input.documentedCriterionFlags[i] ? [i] : [],
  );
  return {
    missingRequiredCriterionIndices: missing,
    missingBlockingCriterionIndices: missing.filter(
      (i) => input.callerBlockingCriterionFlags[i] === 1,
    ),
    requiredDocumentationComplete: missing.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requiredCriterionFlags: [1, 1, 0],
  documentedCriterionFlags: [1, 0, 0],
  callerBlockingCriterionFlags: [0, 1, 0],
} satisfies Input;
export const exampleOutput = {
  missingRequiredCriterionIndices: [1],
  missingBlockingCriterionIndices: [1],
  requiredDocumentationComplete: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/deaccession-criteria-checker",
  title: "Deaccession Justification Criteria Checklist Completeness Checker",
  description:
    "Audit deaccession documentation against caller required/blocking criteria while retaining missing evidence; completeness is not ethical/legal authorization to dispose of collection objects.",
  inputs: inputFields,
  outputs: [
    {
      id: "missingRequiredCriterionIndices",
      label: "Missing required criterion indices",
      kind: "numberList",
    },
    {
      id: "missingBlockingCriterionIndices",
      label: "Missing blocking criterion indices",
      kind: "numberList",
    },
    {
      id: "requiredDocumentationComplete",
      label: "Required documentation complete",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      requiredCriterionFlags: value.requiredCriterionFlags as readonly number[],
      documentedCriterionFlags:
        value.documentedCriterionFlags as readonly number[],
      callerBlockingCriterionFlags:
        value.callerBlockingCriterionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
