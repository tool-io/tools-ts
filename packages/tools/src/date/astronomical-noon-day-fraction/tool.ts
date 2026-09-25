import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ julianDay: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "julianDay", label: "Julian day", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.julianDay, 0, 1000000000);
  return H.finish({
    fractionSinceNoon: H.mod(i.julianDay, 1),
    fractionSinceMidnight: H.mod(i.julianDay + 0.5, 1),
  });
};
export const example = {
  input: { julianDay: 2451545 },
  output: { result: { fractionSinceNoon: 0, fractionSinceMidnight: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/astronomical-noon-day-fraction",
  title: "Date: Astronomical Noon Day Fraction Tool",
  description:
    "Distinguish Julian-day noon-based fractional phase from civil-midnight phase in the same unspecified timescale; does not convert time standards or civil dates.",
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
          fractionSinceMidnight: { type: "number" },
          fractionSinceNoon: { type: "number" },
        },
        required: ["fractionSinceMidnight", "fractionSinceNoon"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
