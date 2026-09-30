import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ verifiedRisshunDate: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "verifiedRisshunDate", label: "Verified risshun date", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    date: H.addDays(i.verifiedRisshunDate, 209),
    inclusiveOrdinal: 210,
  });
};
export const example = {
  input: { verifiedRisshunDate: "2024-02-04" },
  output: { result: { date: "2024-08-31", inclusiveOrdinal: 210 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "japanese-calendar/nihyakutoka",
  title: "Japanese Nihyakutoka Date Calculator",
  description:
    "Count the conventional 210th day inclusively from an independently established Risshun Gregorian date; no solar-term ephemeris or agronomic prediction.",
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
          date: { type: "string" },
          inclusiveOrdinal: { type: "number" },
        },
        required: ["date", "inclusiveOrdinal"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
