import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  angleDegrees: number;
  sourceConvention: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "angleDegrees", label: "Angle degrees", kind: "number", unit: "deg" },
  {
    id: "sourceConvention",
    label: "Source convention",
    kind: "string",
    enum: ["polar", "elevation"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.sourceConvention, ["polar", "elevation"]);
  H.bounded(
    i.angleDegrees,
    i.sourceConvention === "polar" ? 0 : -90,
    i.sourceConvention === "polar" ? 180 : 90,
  );
  return H.finish({
    convertedDegrees: 90 - i.angleDegrees,
    targetConvention: i.sourceConvention === "polar" ? "elevation" : "polar",
  });
};
export const example = {
  input: { angleDegrees: 30, sourceConvention: "polar" },
  output: { result: { convertedDegrees: 60, targetConvention: "elevation" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vector/vector-polar-elevation-convention",
  title: "Vector: Vector Polar Elevation Convention Tool",
  description:
    "Crosswalk spherical polar angle from +z and elevation above the xy plane with explicit convention-specific domains.",
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
          convertedDegrees: { type: "number" },
          targetConvention: { type: "string" },
        },
        required: ["convertedDegrees", "targetConvention"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
