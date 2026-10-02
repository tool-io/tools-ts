import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ indicator: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "indicator", label: "Indicator", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^[|>](?:[1-9][+-]?|[+-][1-9]?)?(?![\s\S])/.test(i.indicator));
  return H.finish({
    style: i.indicator[0] === "|" ? "literal" : "folded",
    chomping: i.indicator.includes("+")
      ? "keep"
      : i.indicator.includes("-")
        ? "strip"
        : "clip",
    explicitIndent: Number(i.indicator.match(/[1-9]/)?.[0] ?? 0),
  });
};
export const example = {
  input: { indicator: "|2-" },
  output: {
    result: { style: "literal", chomping: "strip", explicitIndent: 2 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/yaml-block-chomp-indicator",
  title: "Parsing: Yaml Block Chomp Indicator Tool",
  description:
    "Parse a restricted YAML block-scalar style/indent/chomping indicator token in either allowed modifier order; does not parse indentation, content or a YAML document.",
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
          chomping: { type: "string" },
          explicitIndent: { type: "number" },
          style: { type: "string" },
        },
        required: ["chomping", "explicitIndent", "style"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
