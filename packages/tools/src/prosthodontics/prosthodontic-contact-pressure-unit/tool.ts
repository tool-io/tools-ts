import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly pressure: number; readonly inputUnit: string };
export type Output = { readonly pascals: number; readonly kilopascals: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressure: { type: "number" },
    inputUnit: { type: "string", maxLength: 8192, enum: ["Pa", "kPa"] },
  },
  required: ["pressure", "inputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pascals: { type: "number" }, kilopascals: { type: "number" } },
  required: ["pascals", "kilopascals"],
} as const;
/** Convert an explicitly supplied signed contact-pressure quantity between pascals and kilopascals without clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pressure, inputUnit } = request;
  const compute = (): Output => {
    H.domain(["Pa", "kPa"].includes(inputUnit), "inputUnit");
    return {
      pascals: inputUnit === "kPa" ? pressure * 1000 : pressure,
      kilopascals: inputUnit === "Pa" ? pressure / 1000 : pressure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pressure: 2.5, inputUnit: "kPa" },
  output: { pascals: 2500, kilopascals: 2.5 },
} satisfies ToolExample<Input, Output>;
export const prosthodonticContactPressureUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["prosthodontics", "health and medicine"],
      keywords: ["prosthodontics", "health and medicine"],
    },
    id: "prosthodontics/prosthodontic-contact-pressure-unit",
    title: "Prosthodontic Contact Pressure Unit",
    description:
      "Convert an explicitly supplied signed contact-pressure quantity between pascals and kilopascals without clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressure: { type: "number" },
        inputUnit: { type: "string", maxLength: 8192, enum: ["Pa", "kPa"] },
      },
      required: ["pressure", "inputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pascals: { type: "number" },
        kilopascals: { type: "number" },
      },
      required: ["pascals", "kilopascals"],
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
          id: "inputUnit",
          label: "Input Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "pascals", label: "Pascals", valueType: { type: "number" } },
        {
          id: "kilopascals",
          label: "Kilopascals",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = prosthodonticContactPressureUnitTool.execute;
export default prosthodonticContactPressureUnitTool;
