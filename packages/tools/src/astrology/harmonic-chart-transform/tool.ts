import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  longitudesDegrees: readonly number[];
  harmonic: number;
  anchorDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "longitudesDegrees",
    label: "Longitudes degrees",
    kind: "numberList",
    unit: "deg",
  },
  { id: "harmonic", label: "Harmonic", kind: "integer" },
  { id: "anchorDegrees", label: "Anchor degrees", kind: "number", unit: "deg" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.harmonic, 1, 128);
  H.bounded(i.anchorDegrees, 0, 360);
  i.longitudesDegrees.forEach((x) => H.bounded(x, 0, 360));
  return H.finish({
    longitudesDegrees: i.longitudesDegrees.map((x) =>
      H.mod(i.anchorDegrees + i.harmonic * (x - i.anchorDegrees), 360),
    ),
  });
};
export const example = {
  input: { longitudesDegrees: [10, 350], harmonic: 2, anchorDegrees: 0 },
  output: { result: { longitudesDegrees: [20, 340] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrology/harmonic-chart-transform",
  title: "Astrological Harmonic Chart Calculator",
  description:
    "Apply an anchored integer angular harmonic to explicit zodiac longitudes with [0,360) normalization; no ephemeris, chart interpretation or predictive claim.",
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
          longitudesDegrees: { type: "array", items: { type: "number" } },
        },
        required: ["longitudesDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
