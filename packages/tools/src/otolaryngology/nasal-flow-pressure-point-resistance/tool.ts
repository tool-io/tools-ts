import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pressureDifference: number;
  readonly volumeFlow: number;
};
export type Output = { readonly signedResistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressureDifference: { type: "number" },
    volumeFlow: { type: "number" },
  },
  required: ["pressureDifference", "volumeFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedResistance: { type: "number" } },
  required: ["signedResistance"],
} as const;
/** Divide an explicit nasal pressure difference by compatible signed volume flow without interpreting airflow limitation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pressureDifference, volumeFlow } = request;
  const compute = (): Output => {
    H.domain(volumeFlow !== 0, "volumeFlow");
    return { signedResistance: pressureDifference / volumeFlow };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pressureDifference: 100, volumeFlow: 200 },
  output: { signedResistance: 0.5 },
} satisfies ToolExample<Input, Output>;
export const nasalFlowPressurePointResistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["otolaryngology", "health and medicine"],
      keywords: ["otolaryngology", "health and medicine"],
    },
    id: "otolaryngology/nasal-flow-pressure-point-resistance",
    title: "Nasal Flow Pressure Point Resistance",
    description:
      "Divide an explicit nasal pressure difference by compatible signed volume flow without interpreting airflow limitation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressureDifference: { type: "number" },
        volumeFlow: { type: "number" },
      },
      required: ["pressureDifference", "volumeFlow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedResistance: { type: "number" } },
      required: ["signedResistance"],
    },
    ports: {
      inputs: [
        {
          id: "pressureDifference",
          label: "Pressure Difference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "volumeFlow",
          label: "Volume Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedResistance",
          label: "Signed Resistance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nasalFlowPressurePointResistanceTool.execute;
export default nasalFlowPressurePointResistanceTool;
