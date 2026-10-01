import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  bearingDegrees: number;
  headingDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "bearingDegrees",
    label: "Bearing degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "headingDegrees",
    label: "Heading degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.bearingDegrees, 0, 360);
  H.bounded(i.headingDegrees, 0, 360);
  const v = H.mod(i.bearingDegrees - i.headingDegrees, 360);
  return H.finish({
    relativeBearingDegrees: v,
    side:
      v === 0 ? "ahead" : v === 180 ? "astern" : v < 180 ? "starboard" : "port",
  });
};
export const example = {
  input: { bearingDegrees: 350, headingDegrees: 10 },
  output: { result: { relativeBearingDegrees: 340, side: "port" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "nautical/bearing-relative-to-vessel-heading",
  title: "Nautical: Bearing Relative To Vessel Heading Tool",
  description:
    "Compute clockwise vessel-relative bearing and geometric port/starboard/ahead/astern labels from same-reference headings, not collision-avoidance advice.",
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
          relativeBearingDegrees: { type: "number" },
          side: { type: "string" },
        },
        required: ["relativeBearingDegrees", "side"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
