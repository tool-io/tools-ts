import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  surprisal: number;
  sourceBase: number;
  targetBase: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "surprisal", label: "Surprisal", kind: "number" },
  { id: "sourceBase", label: "Source base", kind: "number" },
  { id: "targetBase", label: "Target base", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.surprisal >= 0 && i.sourceBase > 1 && i.targetBase > 1);
  return H.finish({
    surprisal: (i.surprisal * Math.log(i.sourceBase)) / Math.log(i.targetBase),
  });
};
export const example = {
  input: { surprisal: 3, sourceBase: 2, targetBase: 8 },
  output: { result: { surprisal: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/surprisal-log-base-crosswalk",
  title: "Information: Surprisal Log Base Crosswalk Tool",
  description:
    "Crosswalk a nonnegative surprisal between explicitly supplied logarithm bases greater than one; no probability reconstruction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { surprisal: { type: "number" } },
        required: ["surprisal"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
