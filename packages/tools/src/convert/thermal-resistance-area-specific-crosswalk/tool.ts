import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly resistance: number; readonly area: number };
export type Output = { readonly areaResistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resistance: { type: "number", minimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["resistance", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { areaResistance: { type: "number" } },
  required: ["areaResistance"],
} as const;
/** Convert kelvin per watt into square metre kelvin per watt using the active heat-transfer area. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { resistance, area } = input;
  const compute = (): Output => {
    H.domain(resistance >= 0);
    H.positive(area);
    return { areaResistance: resistance * area };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { resistance: 2, area: 3 },
  output: { areaResistance: 6 },
} satisfies ToolExample<Input, Output>;
export const thermalResistanceAreaSpecificCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/thermal-resistance-area-specific-crosswalk",
      title: "Thermal Resistance Area Specific Crosswalk Tool",
      description:
        "Convert kelvin per watt into square metre kelvin per watt using the active heat-transfer area.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resistance: { type: "number", minimum: 0 },
          area: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["resistance", "area"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { areaResistance: { type: "number" } },
        required: ["areaResistance"],
      },
      ports: {
        inputs: [
          {
            id: "resistance",
            label: "Resistance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "area",
            label: "Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "areaResistance",
            label: "Area Resistance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = thermalResistanceAreaSpecificCrosswalkTool.execute;
export default thermalResistanceAreaSpecificCrosswalkTool;
