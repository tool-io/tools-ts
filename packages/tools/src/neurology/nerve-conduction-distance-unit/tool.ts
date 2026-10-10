import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly distance: number; readonly sourceUnit: string };
export type Output = {
  readonly millimeters: number;
  readonly centimeters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    sourceUnit: { type: "string", maxLength: 8192, enum: ["mm", "cm"] },
  },
  required: ["distance", "sourceUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    millimeters: { type: "number" },
    centimeters: { type: "number" },
  },
  required: ["millimeters", "centimeters"],
} as const;
/** Convert an explicitly measured nerve-study distance between millimeters and centimeters without computing conduction velocity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, sourceUnit } = request;
  const compute = (): Output => {
    H.domain(distance >= 0, "distance");
    H.domain(["mm", "cm"].includes(sourceUnit), "sourceUnit");
    return {
      millimeters: sourceUnit === "cm" ? distance * 10 : distance,
      centimeters: sourceUnit === "mm" ? distance / 10 : distance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 12, sourceUnit: "cm" },
  output: { millimeters: 120, centimeters: 12 },
} satisfies ToolExample<Input, Output>;
export const nerveConductionDistanceUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neurology", "health and medicine"],
      keywords: ["neurology", "health and medicine"],
    },
    id: "neurology/nerve-conduction-distance-unit",
    title: "Nerve Conduction Distance Unit",
    description:
      "Convert an explicitly measured nerve-study distance between millimeters and centimeters without computing conduction velocity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        sourceUnit: { type: "string", maxLength: 8192, enum: ["mm", "cm"] },
      },
      required: ["distance", "sourceUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        millimeters: { type: "number" },
        centimeters: { type: "number" },
      },
      required: ["millimeters", "centimeters"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
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
        {
          id: "centimeters",
          label: "Centimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nerveConductionDistanceUnitTool.execute;
export default nerveConductionDistanceUnitTool;
