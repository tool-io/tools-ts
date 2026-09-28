import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  latitudeDegrees: number;
  sphereRadius: number;
  pole: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "latitudeDegrees",
    label: "Latitude degrees",
    kind: "number",
    unit: "deg",
  },
  { id: "sphereRadius", label: "Sphere radius", kind: "number" },
  { id: "pole", label: "Pole", kind: "string", enum: ["north", "south"] },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.latitudeDegrees, -90, 90);
  H.positive(i.sphereRadius);
  H.choice(i.pole, ["north", "south"]);
  return H.finish({
    capHeight:
      i.sphereRadius *
      (1 -
        (i.pole === "north" ? 1 : -1) * Math.sin(H.radians(i.latitudeDegrees))),
  });
};
export const example = {
  input: { latitudeDegrees: 0, sphereRadius: 2, pole: "north" },
  output: { result: { capHeight: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geography/spherical-cap-latitude-height",
  title: "Geography: Spherical Cap Latitude Height Tool",
  description:
    "Compute spherical polar-cap height above an explicit latitude plane for a north/south pole; spherical geometry, not an ellipsoid or terrain elevation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { capHeight: { type: "number" } },
        required: ["capHeight"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
