import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "token", kind: "string", label: "token" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const chars = i.token.split("");
  let position: number | null = null;
  for (let j = 0; j < chars.length; j++)
    if (!/[0-9+\-.eE]/.test(chars[j])) {
      position = j;
      break;
    }
  let valid = true;
  try {
    H.numericToken(i.token);
  } catch {
    valid = false;
  }
  return H.finish({
    valid,
    invalidCharacterPosition: position,
    grammarErrorWithoutIllegalCharacter: !valid && position === null,
  });
};
export const example = {
  input: { token: "12x3" },
  output: {
    result: {
      valid: false,
      invalidCharacterPosition: 2,
      grammarErrorWithoutIllegalCharacter: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/numeric-token-error-position",
  title: "Numeric Token Error Position Finder",
  description:
    "Find the first illegal UTF-16 character in a strict numeric token and separately flag grammar errors made only of allowed characters; does not claim a full parser failure position.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          valid: { type: "boolean" },
          invalidCharacterPosition: {
            anyOf: [{ type: "number" }, { type: "null" }],
          },
          grammarErrorWithoutIllegalCharacter: { type: "boolean" },
        },
        required: [
          "valid",
          "invalidCharacterPosition",
          "grammarErrorWithoutIllegalCharacter",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
