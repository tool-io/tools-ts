import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly pressure: number; readonly unit: string };
export type Output = { readonly label: string; readonly pressurePa: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressure: { type: "number" },
    unit: { type: "string", maxLength: 8192, enum: ["Pa", "daPa"] },
  },
  required: ["pressure", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    pressurePa: { type: "number" },
  },
  required: ["label", "pressurePa"],
} as const;
/** Label a signed tympanometry pressure and convert explicit decapascals or pascals to pascals without interpreting a tympanogram. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pressure, unit } = request;
  const compute = (): Output => {
    H.domain(["Pa", "daPa"].includes(unit), "unit");
    return {
      label: pressure + " " + unit,
      pressurePa: unit === "daPa" ? pressure * 10 : pressure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pressure: -100, unit: "daPa" },
  output: { label: "-100 daPa", pressurePa: -1000 },
} satisfies ToolExample<Input, Output>;
export const tympanometryPressureUnitLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/tympanometry-pressure-unit-label",
    title: "Tympanometry Pressure Unit Label",
    description:
      "Label a signed tympanometry pressure and convert explicit decapascals or pascals to pascals without interpreting a tympanogram.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressure: { type: "number" },
        unit: { type: "string", maxLength: 8192, enum: ["Pa", "daPa"] },
      },
      required: ["pressure", "unit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        pressurePa: { type: "number" },
      },
      required: ["label", "pressurePa"],
    },
    ports: {
      inputs: [
        {
          id: "pressure",
          label: "Pressure",
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
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "pressurePa",
          label: "Pressure Pa",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tympanometryPressureUnitLabelTool.execute;
export default tympanometryPressureUnitLabelTool;
