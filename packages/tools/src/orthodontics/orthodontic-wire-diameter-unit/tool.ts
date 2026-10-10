import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly diameter: number; readonly inputUnit: string };
export type Output = { readonly millimeters: number; readonly inches: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameter: { type: "number", minimum: 0 },
    inputUnit: { type: "string", maxLength: 8192, enum: ["mm", "in"] },
  },
  required: ["diameter", "inputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { millimeters: { type: "number" }, inches: { type: "number" } },
  required: ["millimeters", "inches"],
} as const;
/** Convert an explicit wire diameter between millimeters and international inches without selecting an orthodontic wire. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diameter, inputUnit } = request;
  const compute = (): Output => {
    H.domain(diameter >= 0, "diameter");
    H.domain(["mm", "in"].includes(inputUnit), "inputUnit");
    return {
      millimeters: inputUnit === "in" ? diameter * 25.4 : diameter,
      inches: inputUnit === "mm" ? diameter / 25.4 : diameter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diameter: 0.02, inputUnit: "in" },
  output: { millimeters: 0.508, inches: 0.02 },
} satisfies ToolExample<Input, Output>;
export const orthodonticWireDiameterUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["orthodontics", "health and medicine"],
      keywords: ["orthodontics", "health and medicine"],
    },
    id: "orthodontics/orthodontic-wire-diameter-unit",
    title: "Orthodontic Wire Diameter Unit",
    description:
      "Convert an explicit wire diameter between millimeters and international inches without selecting an orthodontic wire.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diameter: { type: "number", minimum: 0 },
        inputUnit: { type: "string", maxLength: 8192, enum: ["mm", "in"] },
      },
      required: ["diameter", "inputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        millimeters: { type: "number" },
        inches: { type: "number" },
      },
      required: ["millimeters", "inches"],
    },
    ports: {
      inputs: [
        {
          id: "diameter",
          label: "Diameter",
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
        {
          id: "millimeters",
          label: "Millimeters",
          valueType: { type: "number" },
        },
        { id: "inches", label: "Inches", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = orthodonticWireDiameterUnitTool.execute;
export default orthodonticWireDiameterUnitTool;
