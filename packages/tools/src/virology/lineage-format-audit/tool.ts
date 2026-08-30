import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly lineage: string;
  readonly maximumNumericDepth: number;
}>;
export type Output = Readonly<{
  readonly validFormat: boolean;
  readonly aliasPrefix: string;
  readonly numericDepth: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.maximumNumericDepth, "maximumNumericDepth", 1);
  const parts = input.lineage.split("."),
    numericDepth = Math.max(0, parts.length - 1),
    validFormat =
      /^[A-Z]{1,3}(?:\.[1-9]\d*)*$/.test(input.lineage) &&
      numericDepth <= input.maximumNumericDepth;
  return { validFormat, aliasPrefix: parts[0], numericDepth };
};
export const exampleInput = {
  lineage: "BA.2.86",
  maximumNumericDepth: 3,
} satisfies Input;
export const exampleOutput = {
  validFormat: true,
  aliasPrefix: "BA",
  numericDepth: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/lineage-format-audit",
  title: "Lineage Format Audit",
  description:
    "Validate Pango-style alias-and-numeric lineage syntax with a caller depth limit; syntax does not confirm an assigned lineage.",
  inputs: [
    { id: "lineage", label: "Lineage", kind: "string" },
    {
      id: "maximumNumericDepth",
      label: "Maximum numeric depth",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "validFormat", label: "Valid format", kind: "boolean" },
    { id: "aliasPrefix", label: "Alias prefix", kind: "string" },
    { id: "numericDepth", label: "Numeric depth", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      lineage: value.lineage as string,
      maximumNumericDepth: value.maximumNumericDepth as number,
    }),
});
export const run = tool.execute;
export default tool;
