import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ speed: number; fromBearingDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "speed", label: "Speed", kind: "number" },
  {
    id: "fromBearingDegrees",
    label: "From bearing degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.speed >= 0);
  H.bounded(i.fromBearingDegrees, 0, 360);
  return H.finish({
    eastward: -i.speed * Math.sin(H.radians(i.fromBearingDegrees)),
    northward: -i.speed * Math.cos(H.radians(i.fromBearingDegrees)),
  });
};
export const example = {
  input: { speed: 10, fromBearingDegrees: 90 },
  output: { result: { eastward: -10, northward: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "atmospheric-science/wind-vector-meteorological-sign",
  title: "Atmospheric Science: Wind Vector Meteorological Sign Tool",
  description:
    "Resolve meteorological wind-from bearing clockwise from north to eastward/northward velocity components; no gust, height or weather prediction.",
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
          eastward: { type: "number" },
          northward: { type: "number" },
        },
        required: ["eastward", "northward"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
