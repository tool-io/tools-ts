import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ lexeme: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lexeme", label: "Lexeme", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?(?![\s\S])/.test(i.lexeme),
  );
  const negative = i.lexeme.startsWith("-"),
    coefficient = i.lexeme.split(/[eE]/)[0],
    zeroCoefficient = !/[1-9]/.test(coefficient);
  return H.finish({
    negativeZero: negative && zeroCoefficient,
    negativeSign: negative,
  });
};
export const example = {
  input: { lexeme: "-0.00e+12" },
  output: { result: { negativeZero: true, negativeSign: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-number-negative-zero-lexeme",
  title: "JSON: JSON Number Negative Zero Lexeme Tool",
  description:
    "Recognize exact lexical negative zero in a strict JSON number without confusing underflowing nonzero coefficients with zero.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          negativeSign: { type: "boolean" },
          negativeZero: { type: "boolean" },
        },
        required: ["negativeSign", "negativeZero"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
