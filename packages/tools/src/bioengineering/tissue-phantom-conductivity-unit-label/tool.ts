import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly conductivity: number; readonly unit: string };
export type Output = {
  readonly label: string;
  readonly siemensPerMeter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductivity: { type: "number", minimum: 0 },
    unit: { type: "string", maxLength: 8192, enum: ["S/m", "mS/cm"] },
  },
  required: ["conductivity", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    siemensPerMeter: { type: "number" },
  },
  required: ["label", "siemensPerMeter"],
} as const;
/** Label a recorded tissue-phantom conductivity and convert explicit S/m or mS/cm to S/m without estimating tissue properties. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conductivity, unit } = request;
  const compute = (): Output => {
    H.domain(conductivity >= 0, "conductivity");
    H.domain(["S/m", "mS/cm"].includes(unit), "unit");
    return {
      label: conductivity + " " + unit,
      siemensPerMeter: unit === "S/m" ? conductivity : conductivity * 0.1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { conductivity: 15, unit: "mS/cm" },
  output: { label: "15 mS/cm", siemensPerMeter: 1.5 },
} satisfies ToolExample<Input, Output>;
export const tissuePhantomConductivityUnitLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/tissue-phantom-conductivity-unit-label",
    title: "Tissue Phantom Conductivity Unit Label",
    description:
      "Label a recorded tissue-phantom conductivity and convert explicit S/m or mS/cm to S/m without estimating tissue properties.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conductivity: { type: "number", minimum: 0 },
        unit: { type: "string", maxLength: 8192, enum: ["S/m", "mS/cm"] },
      },
      required: ["conductivity", "unit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        siemensPerMeter: { type: "number" },
      },
      required: ["label", "siemensPerMeter"],
    },
    ports: {
      inputs: [
        {
          id: "conductivity",
          label: "Conductivity",
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
          id: "siemensPerMeter",
          label: "Siemens Per Meter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissuePhantomConductivityUnitLabelTool.execute;
export default tissuePhantomConductivityUnitLabelTool;
