import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly recoveryCode: string;
  readonly callerAlphabet: string;
  readonly callerGroupLengths: readonly number[];
  readonly callerSeparator: string;
}>;
export type Output = Readonly<{
  readonly validCallerRecoveryFormat: boolean;
  readonly observedGroupLengths: readonly number[];
}>;
const inputFields = [
  { id: "recoveryCode", label: "Recovery code", kind: "string" },
  { id: "callerAlphabet", label: "Caller alphabet", kind: "string" },
  {
    id: "callerGroupLengths",
    label: "Caller group lengths",
    kind: "numberList",
  },
  { id: "callerSeparator", label: "Caller separator", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.callerSeparator.length !== 1 ||
    input.callerAlphabet.includes(input.callerSeparator) ||
    new Set(input.callerAlphabet).size !== input.callerAlphabet.length ||
    !input.callerAlphabet.length ||
    input.callerAlphabet.length > 128
  )
    simpleError(
      "policy",
      "Explicit distinct alphabet and excluded single-character separator required.",
    );
  input.callerGroupLengths.forEach((v) => bounded(v, "length", 1, 128));
  if (input.recoveryCode.length > 16384)
    simpleError("code", "Bounded recovery code required.");
  const groups = input.recoveryCode.split(input.callerSeparator);
  return {
    validCallerRecoveryFormat:
      groups.length === input.callerGroupLengths.length &&
      groups.every(
        (v, i) =>
          v.length === input.callerGroupLengths[i] &&
          [...v].every((c) => input.callerAlphabet.includes(c)),
      ),
    observedGroupLengths: groups.map((v) => v.length),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  recoveryCode: "ABCD-EFGH",
  callerAlphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  callerGroupLengths: [4, 4],
  callerSeparator: "-",
} satisfies Input;
export const exampleOutput = {
  validCallerRecoveryFormat: true,
  observedGroupLengths: [4, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/recovery-code-group-formatting-checker",
  title: "Recovery Code Group Format Check",
  description:
    "Audit caller recovery-code alphabet/group policy only, format does not establish issued/unused recovery code or entropy.",
  inputs: inputFields,
  outputs: [
    {
      id: "validCallerRecoveryFormat",
      label: "Valid caller recovery format",
      kind: "boolean",
    },
    {
      id: "observedGroupLengths",
      label: "Observed group lengths",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      recoveryCode: value.recoveryCode as string,
      callerAlphabet: value.callerAlphabet as string,
      callerGroupLengths: value.callerGroupLengths as readonly number[],
      callerSeparator: value.callerSeparator as string,
    }),
});
export const run = tool.execute;
export default tool;
