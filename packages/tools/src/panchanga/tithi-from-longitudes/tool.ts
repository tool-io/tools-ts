import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  sunLongitudeDegrees: number;
  moonLongitudeDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "sunLongitudeDegrees",
    label: "Sun longitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "moonLongitudeDegrees",
    label: "Moon longitude degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.sunLongitudeDegrees, 0, 360);
  H.bounded(i.moonLongitudeDegrees, 0, 360);
  const elongation = H.mod(i.moonLongitudeDegrees - i.sunLongitudeDegrees, 360),
    ordinal = Math.floor(elongation / 12) + 1;
  return H.finish({
    tithiOrdinal: ordinal,
    fractionalProgress: (elongation % 12) / 12,
    elongationDegrees: elongation,
  });
};
export const example = {
  input: { sunLongitudeDegrees: 350, moonLongitudeDegrees: 8 },
  output: {
    result: { tithiOrdinal: 2, fractionalProgress: 0.5, elongationDegrees: 18 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "panchanga/tithi-from-longitudes",
  title: "Panchanga Tithi Calculator",
  description:
    "Compute geometric tithi index and progress from same-frame geocentric Sun/Moon longitudes using half-open 12-degree elongation bins; no sunrise assignment or ephemeris.",
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
          elongationDegrees: { type: "number" },
          fractionalProgress: { type: "number" },
          tithiOrdinal: { type: "number" },
        },
        required: ["elongationDegrees", "fractionalProgress", "tithiOrdinal"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
