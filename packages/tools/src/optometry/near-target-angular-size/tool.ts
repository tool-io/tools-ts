import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetSize: number;
  readonly viewingDistance: number;
};
export type Output = { readonly angleRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetSize: { type: "number", minimum: 0 },
    viewingDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["targetSize", "viewingDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angleRadians: { type: "number" } },
  required: ["angleRadians"],
} as const;
/** Compute exact geometric angular extent of a centered planar target from compatible supplied dimensions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetSize, viewingDistance } = request;
  const compute = (): Output => {
    H.domain(targetSize >= 0);
    H.positive(viewingDistance);
    return { angleRadians: 2 * Math.atan2(targetSize / 2, viewingDistance) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetSize: 2, viewingDistance: 1 },
  output: { angleRadians: 1.5707963267948966 },
} satisfies ToolExample<Input, Output>;
export const nearTargetAngularSizeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/near-target-angular-size",
    title: "Near Target Angular Size Tool",
    description:
      "Compute exact geometric angular extent of a centered planar target from compatible supplied dimensions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetSize: { type: "number", minimum: 0 },
        viewingDistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["targetSize", "viewingDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angleRadians: { type: "number" } },
      required: ["angleRadians"],
    },
    ports: {
      inputs: [
        {
          id: "targetSize",
          label: "Target Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "viewingDistance",
          label: "Viewing Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "angleRadians",
          label: "Angle Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nearTargetAngularSizeTool.execute;
export default nearTargetAngularSizeTool;
