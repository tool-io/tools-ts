import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coldReading: number;
  readonly warmReading: number;
  readonly referenceDifference: number;
};
export type Output = {
  readonly observedDifference: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coldReading: { type: "number" },
    warmReading: { type: "number" },
    referenceDifference: { type: "number" },
  },
  required: ["coldReading", "warmReading", "referenceDifference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDifference: { type: "number" },
    residual: { type: "number" },
  },
  required: ["observedDifference", "residual"],
} as const;
/** Compare an explicitly measured warm-minus-cold sensor difference with a supplied reference difference in common temperature units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coldReading, warmReading, referenceDifference } = request;
  const compute = (): Output => {
    return {
      observedDifference: warmReading - coldReading,
      residual: warmReading - coldReading - referenceDifference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coldReading: 4, warmReading: 300, referenceDifference: 295 },
  output: { observedDifference: 296, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const sensorColdWarmReferenceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cryogenics", "physics"],
      keywords: ["cryogenics", "physics"],
    },
    id: "cryogenics/sensor-cold-warm-reference-residual",
    title: "Sensor Cold Warm Reference Residual",
    description:
      "Compare an explicitly measured warm-minus-cold sensor difference with a supplied reference difference in common temperature units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coldReading: { type: "number" },
        warmReading: { type: "number" },
        referenceDifference: { type: "number" },
      },
      required: ["coldReading", "warmReading", "referenceDifference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedDifference: { type: "number" },
        residual: { type: "number" },
      },
      required: ["observedDifference", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "coldReading",
          label: "Cold Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "warmReading",
          label: "Warm Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDifference",
          label: "Reference Difference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedDifference",
          label: "Observed Difference",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sensorColdWarmReferenceResidualTool.execute;
export default sensorColdWarmReferenceResidualTool;
