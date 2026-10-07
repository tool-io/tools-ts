import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly forceX: number; readonly forceY: number };
export type Output = {
  readonly shearMagnitude: number;
  readonly angleRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { forceX: { type: "number" }, forceY: { type: "number" } },
  required: ["forceX", "forceY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shearMagnitude: { type: "number" },
    angleRadians: { type: "number" },
  },
  required: ["shearMagnitude", "angleRadians"],
} as const;
/** Report nonzero supplied forceplate shear magnitude and atan2 direction in radians from the positive x axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forceX, forceY } = request;
  const compute = (): Output => {
    H.domain(forceX !== 0 || forceY !== 0, "forceX");
    return {
      shearMagnitude: Math.hypot(forceX, forceY),
      angleRadians: Math.atan2(forceY, forceX),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forceX: 3, forceY: 4 },
  output: { shearMagnitude: 5, angleRadians: 0.9272952180016122 },
} satisfies ToolExample<Input, Output>;
export const forceplateShearResultantAngleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomechanics", "engineering"],
      keywords: ["biomechanics", "engineering"],
    },
    id: "biomechanics/force-plate-shear-resultant-angle",
    title: "Force Plate Shear Resultant Angle",
    description:
      "Report nonzero supplied forceplate shear magnitude and atan2 direction in radians from the positive x axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { forceX: { type: "number" }, forceY: { type: "number" } },
      required: ["forceX", "forceY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shearMagnitude: { type: "number" },
        angleRadians: { type: "number" },
      },
      required: ["shearMagnitude", "angleRadians"],
    },
    ports: {
      inputs: [
        {
          id: "forceX",
          label: "Force X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forceY",
          label: "Force Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shearMagnitude",
          label: "Shear Magnitude",
          valueType: { type: "number" },
        },
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
export const run = forceplateShearResultantAngleTool.execute;
export default forceplateShearResultantAngleTool;
