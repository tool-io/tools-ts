import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: string; readonly unit: string };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    unit: { type: "string", maxLength: 8192, enum: ["C", "F", "K"] },
  },
  required: ["value", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate degree symbol temperature unit spacing from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, unit } = request;
  const compute = (): Output => {
    H.domain(["C", "F", "K"].includes(unit));
    return { text: value + " " + (unit === "K" ? "K" : "°" + unit) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: "20", unit: "C" },
  output: { text: "20 °C" },
} satisfies ToolExample<Input, Output>;
export const degreeSymbolTemperatureUnitSpacingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/degree-symbol-temperature-unit-spacing",
    title: "Degree Symbol Temperature Unit Spacing Tool",
    description:
      "Calculate degree symbol temperature unit spacing from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "string", maxLength: 8192 },
        unit: { type: "string", maxLength: 8192, enum: ["C", "F", "K"] },
      },
      required: ["value", "unit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = degreeSymbolTemperatureUnitSpacingTool.execute;
export default degreeSymbolTemperatureUnitSpacingTool;
