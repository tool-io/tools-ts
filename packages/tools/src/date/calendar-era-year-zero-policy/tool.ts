import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ astronomicalYear: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "astronomicalYear", label: "Astronomical year", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.astronomicalYear, -9999, 9999);
  return H.finish({
    era: i.astronomicalYear > 0 ? "CE" : "BCE",
    eraYear:
      i.astronomicalYear > 0 ? i.astronomicalYear : 1 - i.astronomicalYear,
  });
};
export const example = {
  input: { astronomicalYear: 0 },
  output: { result: { era: "BCE", eraYear: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/calendar-era-year-zero-policy",
  title: "Date: Calendar Era Year Zero Policy Tool",
  description:
    "Convert an astronomical signed year with year zero into a positive BCE/CE era year, without jurisdictional calendar adoption rules.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { era: { type: "string" }, eraYear: { type: "number" } },
        required: ["era", "eraYear"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
