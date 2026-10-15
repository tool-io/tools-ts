import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualCandidateUsername: string;
  readonly callerObservedUnavailableUsernames: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualCandidateUsername",
    label: "Actual candidate username",
    kind: "string",
  },
  {
    id: "callerObservedUnavailableUsernames",
    label: "Caller observed unavailable usernames",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (!input.actualCandidateUsername.trim())
    simpleError("username", "Nonblankcandidate.");
  unique(input.callerObservedUnavailableUsernames, "observations");
  return {
    matchesDeclaredLocalSyntax: /^[A-Za-z][A-Za-z0-9_]{2,19}$/.test(
      input.actualCandidateUsername,
    ),
    notInCallerUnavailableList:
      !input.callerObservedUnavailableUsernames.includes(
        input.actualCandidateUsername,
      ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualCandidateUsername: "juniper_3",
    callerObservedUnavailableUsernames: ["maple"],
  },
  output: {
    result: {
      matchesDeclaredLocalSyntax: true,
      notInCallerUnavailableList: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/username-rater",
  title: "Username Availability Fun Rater",
  description:
    "Declaredlocal3\u201320ASCIIusername syntaxandfinitecalleroccupiedlistONLY,no networkactualavailability,brand suitability or safety. Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          matchesDeclaredLocalSyntax: { type: "boolean" },
          notInCallerUnavailableList: { type: "boolean" },
        },
        required: ["matchesDeclaredLocalSyntax", "notInCallerUnavailableList"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
