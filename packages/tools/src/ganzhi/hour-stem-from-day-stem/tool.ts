import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ dayStemIndex: number; hourBranchIndex: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "dayStemIndex", label: "Day stem index", kind: "integer" },
  { id: "hourBranchIndex", label: "Hour branch index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.dayStemIndex, 0, 9);
  H.int(i.hourBranchIndex, 0, 11);
  return H.finish({
    hourStemIndex: (2 * (i.dayStemIndex % 5) + i.hourBranchIndex) % 10,
  });
};
export const example = {
  input: { dayStemIndex: 0, hourBranchIndex: 0 },
  output: { result: { hourStemIndex: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ganzhi/hour-stem-from-day-stem",
  title: "Hour Heavenly Stem Calculator",
  description:
    "Apply the conventional five-rat hour-stem rule to already established zero-based day-stem and hour-branch indices, not a date/ephemeris solver.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { hourStemIndex: { type: "number" } },
        required: ["hourStemIndex"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
