import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  leafWidth: number;
  hingeAxisOffset: number;
  openingDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leafWidth", label: "Leaf width", kind: "number" },
  { id: "hingeAxisOffset", label: "Hinge axis offset", kind: "number" },
  {
    id: "openingDegrees",
    label: "Opening degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.leafWidth);
  H.bounded(i.hingeAxisOffset, 0, i.leafWidth);
  H.bounded(i.openingDegrees, 0, 180);
  return H.finish({
    outerEdgeNormalProjection:
      (i.leafWidth - i.hingeAxisOffset) * Math.sin(H.radians(i.openingDegrees)),
    outerEdgeAlongProjection:
      i.hingeAxisOffset +
      (i.leafWidth - i.hingeAxisOffset) * Math.cos(H.radians(i.openingDegrees)),
  });
};
export const example = {
  input: { leafWidth: 10, hingeAxisOffset: 2, openingDegrees: 90 },
  output: {
    result: { outerEdgeNormalProjection: 8, outerEdgeAlongProjection: 2 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "architecture/door-leaf-clearance-hinge-offset",
  title: "Architecture: Door Leaf Clearance Hinge Offset Tool",
  description:
    "Project a zero-thickness door leaf outer edge about an explicitly offset hinge axis in plan; not a clearance, accessibility or building-code certification.",
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
          outerEdgeAlongProjection: { type: "number" },
          outerEdgeNormalProjection: { type: "number" },
        },
        required: ["outerEdgeAlongProjection", "outerEdgeNormalProjection"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
