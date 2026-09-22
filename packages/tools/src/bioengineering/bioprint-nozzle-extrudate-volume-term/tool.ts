import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diameter: number;
  readonly depositedLength: number;
  readonly flowCorrection: number;
};
export type Output = {
  readonly idealVolume: number;
  readonly correctedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameter: { type: "number", minimum: 0 },
    depositedLength: { type: "number", minimum: 0 },
    flowCorrection: { type: "number", minimum: 0 },
  },
  required: ["diameter", "depositedLength", "flowCorrection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idealVolume: { type: "number" },
    correctedVolume: { type: "number" },
  },
  required: ["idealVolume", "correctedVolume"],
} as const;
/** Circular deposited filament with an explicit volume correction, without selecting bioink or print conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diameter, depositedLength, flowCorrection } = request;
  const compute = (): Output => {
    H.domain(diameter >= 0 && depositedLength >= 0 && flowCorrection >= 0);
    return {
      idealVolume: (Math.PI * diameter ** 2 * depositedLength) / 4,
      correctedVolume:
        (Math.PI * diameter ** 2 * depositedLength * flowCorrection) / 4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diameter: 2, depositedLength: 10, flowCorrection: 1 },
  output: {
    idealVolume: 31.41592653589793,
    correctedVolume: 31.41592653589793,
  },
} satisfies ToolExample<Input, Output>;
export const bioprintNozzleExtrudateVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/bioprint-nozzle-extrudate-volume-term",
    title: "Bioprint Nozzle Extrudate Volume Term Tool",
    description:
      "Circular deposited filament with an explicit volume correction, without selecting bioink or print conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diameter: { type: "number", minimum: 0 },
        depositedLength: { type: "number", minimum: 0 },
        flowCorrection: { type: "number", minimum: 0 },
      },
      required: ["diameter", "depositedLength", "flowCorrection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        idealVolume: { type: "number" },
        correctedVolume: { type: "number" },
      },
      required: ["idealVolume", "correctedVolume"],
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
          id: "depositedLength",
          label: "Deposited Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "flowCorrection",
          label: "Flow Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "idealVolume",
          label: "Ideal Volume",
          valueType: { type: "number" },
        },
        {
          id: "correctedVolume",
          label: "Corrected Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bioprintNozzleExtrudateVolumeTermTool.execute;
export default bioprintNozzleExtrudateVolumeTermTool;
