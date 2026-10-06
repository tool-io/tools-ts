import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly weight: number; readonly unit: string };
export type Output = { readonly kilograms: number; readonly pounds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weight: { type: "number", minimum: 0 },
    unit: { type: "string", maxLength: 8192, enum: ["kg", "lb"] },
  },
  required: ["weight", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { kilograms: { type: "number" }, pounds: { type: "number" } },
  required: ["kilograms", "pounds"],
} as const;
/** Convert a recorded birth weight between kilograms and international avoirdupois pounds without classifying the weight. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weight, unit } = request;
  const compute = (): Output => {
    H.domain(weight >= 0, "weight");
    H.domain(["kg", "lb"].includes(unit), "unit");
    const kilograms = unit === "kg" ? weight : weight * 0.45359237;
    return { kilograms, pounds: unit === "lb" ? weight : weight / 0.45359237 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weight: 80, unit: "lb" },
  output: { kilograms: 36.287389600000004, pounds: 80 },
} satisfies ToolExample<Input, Output>;
export const calfBirthWeightRecordUnitCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/calf-birth-weight-record-unit-crosswalk",
    title: "Calf Birth Weight Record Unit Crosswalk",
    description:
      "Convert a recorded birth weight between kilograms and international avoirdupois pounds without classifying the weight.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weight: { type: "number", minimum: 0 },
        unit: { type: "string", maxLength: 8192, enum: ["kg", "lb"] },
      },
      required: ["weight", "unit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { kilograms: { type: "number" }, pounds: { type: "number" } },
      required: ["kilograms", "pounds"],
    },
    ports: {
      inputs: [
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "kilograms", label: "Kilograms", valueType: { type: "number" } },
        { id: "pounds", label: "Pounds", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = calfBirthWeightRecordUnitCrosswalkTool.execute;
export default calfBirthWeightRecordUnitCrosswalkTool;
