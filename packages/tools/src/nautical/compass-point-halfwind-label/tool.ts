import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ bearingDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "bearingDegrees",
    label: "Bearing degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.bearingDegrees, 0, 360);
  const labels = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ],
    index = Math.floor((H.mod(i.bearingDegrees, 360) + 11.25) / 22.5) % 16;
  return H.finish({ point: labels[index], index });
};
export const example = {
  input: { bearingDegrees: 22.5 },
  output: { result: { point: "NNE", index: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "nautical/compass-point-halfwind-label",
  title: "Nautical: Compass Point Halfwind Label Tool",
  description:
    "Label a bearing by the nearest sixteen-point compass halfwind with clockwise half-open ties; no magnetic correction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { index: { type: "number" }, point: { type: "string" } },
        required: ["index", "point"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
