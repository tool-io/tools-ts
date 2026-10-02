import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly wheelbase: number; readonly clearance: number };
export type Output = { readonly breakoverAngleRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wheelbase: { type: "number", exclusiveMinimum: 0 },
    clearance: { type: "number", minimum: 0 },
  },
  required: ["wheelbase", "clearance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { breakoverAngleRadians: { type: "number" } },
  required: ["breakoverAngleRadians"],
} as const;
/** Ideal centered underbody breakover angle over a sharp convex crest; excludes wheel deformation and overhang. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wheelbase, clearance } = request;
  const compute = (): Output => {
    H.positive(wheelbase);
    H.domain(clearance >= 0);
    return { breakoverAngleRadians: 2 * Math.atan2(2 * clearance, wheelbase) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wheelbase: 2, clearance: 0.5 },
  output: { breakoverAngleRadians: 0.9272952180016122 },
} satisfies ToolExample<Input, Output>;
export const touringCaseWheelbaseRampAngleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/touring-case-wheelbase-ramp-angle",
    title: "Touring Case Wheelbase Ramp Angle Tool",
    description:
      "Ideal centered underbody breakover angle over a sharp convex crest; excludes wheel deformation and overhang.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wheelbase: { type: "number", exclusiveMinimum: 0 },
        clearance: { type: "number", minimum: 0 },
      },
      required: ["wheelbase", "clearance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { breakoverAngleRadians: { type: "number" } },
      required: ["breakoverAngleRadians"],
    },
    ports: {
      inputs: [
        {
          id: "wheelbase",
          label: "Wheelbase",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clearance",
          label: "Clearance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "breakoverAngleRadians",
          label: "Breakover Angle Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = touringCaseWheelbaseRampAngleTool.execute;
export default touringCaseWheelbaseRampAngleTool;
