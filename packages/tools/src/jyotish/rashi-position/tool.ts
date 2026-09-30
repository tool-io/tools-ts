import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ siderealLongitudeDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "siderealLongitudeDegrees",
    label: "Sidereal longitude degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.siderealLongitudeDegrees, 0, 360);
  const v = H.mod(i.siderealLongitudeDegrees, 360);
  return H.finish({
    rashiOrdinal: Math.floor(v / 30) + 1,
    withinSignDegrees: v % 30,
  });
};
export const example = {
  input: { siderealLongitudeDegrees: 35 },
  output: { result: { rashiOrdinal: 2, withinSignDegrees: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "jyotish/rashi-position",
  title: "Jyotish Rashi and Degree Calculator",
  description:
    "Resolve already sidereal longitude into a one-based equal 30-degree rashi and within-sign degree; no tropical/sidereal equivalence or prediction.",
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
          rashiOrdinal: { type: "number" },
          withinSignDegrees: { type: "number" },
        },
        required: ["rashiOrdinal", "withinSignDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
