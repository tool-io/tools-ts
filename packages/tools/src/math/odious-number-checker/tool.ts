import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch49-shared.js";
export type Input = Readonly<{ readonly actualNonnegativeSafeInteger: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualNonnegativeSafeInteger",
    label: "Actual nonnegative safe integer",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (
    !Number.isSafeInteger(input.actualNonnegativeSafeInteger) ||
    input.actualNonnegativeSafeInteger < 0
  )
    simpleError("integer", "Actualnonnegativesafeinteger.");
  const n =
    input.actualNonnegativeSafeInteger.toString(2).split("1").length - 1;
  return { isOdious: n % 2 === 1, binaryOneBitCount: n };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualNonnegativeSafeInteger: 7 },
  output: { result: { isOdious: true, binaryOneBitCount: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/odious-number-checker",
  title: "Odious Number Checker",
  description:
    "Odious integer has odd count of1bits in unsigned binary, zero even/not odious; arithmetic uses full safe integer not32bit truncation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          isOdious: { type: "boolean" },
          binaryOneBitCount: { type: "number" },
        },
        required: ["isOdious", "binaryOneBitCount"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
