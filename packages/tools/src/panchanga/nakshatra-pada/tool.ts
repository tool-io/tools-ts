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
  const scaled = (H.mod(i.siderealLongitudeDegrees, 360) * 3) / 40,
    n = Math.floor(scaled);
  return H.finish({
    nakshatraOrdinal: n + 1,
    pada: Math.min(4, Math.floor((scaled - n) * 4) + 1),
    fractionalNakshatra: scaled - n,
  });
};
export const example = {
  input: { siderealLongitudeDegrees: 5 },
  output: {
    result: { nakshatraOrdinal: 1, pada: 2, fractionalNakshatra: 0.375 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "panchanga/nakshatra-pada",
  title: "Panchanga Nakshatra Pada Calculator",
  description:
    "Resolve an explicitly established sidereal longitude into equal 27-fold nakshatra and quarter/pada bins; no ayanamsha selection or date calculation.",
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
          fractionalNakshatra: { type: "number" },
          nakshatraOrdinal: { type: "number" },
          pada: { type: "number" },
        },
        required: ["fractionalNakshatra", "nakshatraOrdinal", "pada"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
