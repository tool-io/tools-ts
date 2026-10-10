import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly radius: number; readonly sourceUnit: string };
export type Output = { readonly millimeters: number; readonly meters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    sourceUnit: { type: "string", maxLength: 8192, enum: ["mm", "m"] },
  },
  required: ["radius", "sourceUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { millimeters: { type: "number" }, meters: { type: "number" } },
  required: ["millimeters", "meters"],
} as const;
/** Convert an explicitly supplied corneal radius between millimeters and meters without estimating refractive power. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, sourceUnit } = request;
  const compute = (): Output => {
    (H.domain(radius > 0, "radius"), radius);
    H.domain(["mm", "m"].includes(sourceUnit), "sourceUnit");
    return {
      millimeters: sourceUnit === "m" ? radius * 1000 : radius,
      meters: sourceUnit === "mm" ? radius / 1000 : radius,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 7.8, sourceUnit: "mm" },
  output: { millimeters: 7.8, meters: 0.0078 },
} satisfies ToolExample<Input, Output>;
export const corneaRadiusUnitCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["ophthalmology", "health and medicine"],
      keywords: ["ophthalmology", "health and medicine"],
    },
    id: "ophthalmology/cornea-radius-unit-crosswalk",
    title: "Cornea Radius Unit Crosswalk",
    description:
      "Convert an explicitly supplied corneal radius between millimeters and meters without estimating refractive power.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", exclusiveMinimum: 0 },
        sourceUnit: { type: "string", maxLength: 8192, enum: ["mm", "m"] },
      },
      required: ["radius", "sourceUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        millimeters: { type: "number" },
        meters: { type: "number" },
      },
      required: ["millimeters", "meters"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceUnit",
          label: "Source Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "millimeters",
          label: "Millimeters",
          valueType: { type: "number" },
        },
        { id: "meters", label: "Meters", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = corneaRadiusUnitCrosswalkTool.execute;
export default corneaRadiusUnitCrosswalkTool;
