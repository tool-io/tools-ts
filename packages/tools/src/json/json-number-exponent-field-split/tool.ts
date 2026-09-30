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
  const m =
    /^(-?(?:0|[1-9]\d*)(?:\.\d+)?)(?:([eE])([+-]?)(\d+))?(?![\s\S])/.exec(
      i.lexeme,
    );
  H.check(m);
  return H.finish({
    mantissa: m![1],
    hasExponent: m![2] !== undefined,
    exponentMarker: m![2] ?? "",
    exponentSign: m![3] ?? "",
    exponentDigits: m![4] ?? "",
  });
};
export const example = {
  input: { lexeme: "-1.20E+003" },
  output: {
    result: {
      mantissa: "-1.20",
      hasExponent: true,
      exponentMarker: "E",
      exponentSign: "+",
      exponentDigits: "003",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-number-exponent-field-split",
  title: "JSON: JSON Number Exponent Field Split Tool",
  description:
    "Split strict JSON number spelling into lexical mantissa/exponent fields while preserving case, sign and leading exponent zeros.",
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
          exponentDigits: { type: "string" },
          exponentMarker: { type: "string" },
          exponentSign: { type: "string" },
          hasExponent: { type: "boolean" },
          mantissa: { type: "string" },
        },
        required: [
          "exponentDigits",
          "exponentMarker",
          "exponentSign",
          "hasExponent",
          "mantissa",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
