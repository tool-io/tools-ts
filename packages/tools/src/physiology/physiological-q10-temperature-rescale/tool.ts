import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceRate: number;
  readonly referenceTemperature: number;
  readonly temperature: number;
  readonly q10: number;
};
export type Output = { readonly factor: number; readonly adjustedRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceRate: { type: "number", minimum: 0 },
    referenceTemperature: { type: "number" },
    temperature: { type: "number" },
    q10: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["referenceRate", "referenceTemperature", "temperature", "q10"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" }, adjustedRate: { type: "number" } },
  required: ["factor", "adjustedRate"],
} as const;
/** Caller-parameterized Q10 rate scaling, without assuming applicability to an organism or endpoint. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceRate, referenceTemperature, temperature, q10 } = request;
  const compute = (): Output => {
    H.domain(referenceRate >= 0);
    H.positive(q10);
    return {
      factor: q10 ** ((temperature - referenceTemperature) / 10),
      adjustedRate:
        referenceRate * q10 ** ((temperature - referenceTemperature) / 10),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceRate: 5,
    referenceTemperature: 20,
    temperature: 30,
    q10: 2,
  },
  output: { factor: 2, adjustedRate: 10 },
} satisfies ToolExample<Input, Output>;
export const physiologicalQ10TemperatureRescaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/physiological-q10-temperature-rescale",
    title: "Physiological Q10 Temperature Rescale Tool",
    description:
      "Caller-parameterized Q10 rate scaling, without assuming applicability to an organism or endpoint.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceRate: { type: "number", minimum: 0 },
        referenceTemperature: { type: "number" },
        temperature: { type: "number" },
        q10: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["referenceRate", "referenceTemperature", "temperature", "q10"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        factor: { type: "number" },
        adjustedRate: { type: "number" },
      },
      required: ["factor", "adjustedRate"],
    },
    ports: {
      inputs: [
        {
          id: "referenceRate",
          label: "Reference Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceTemperature",
          label: "Reference Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperature",
          label: "Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "q10",
          label: "Q10",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "factor", label: "Factor", valueType: { type: "number" } },
        {
          id: "adjustedRate",
          label: "Adjusted Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = physiologicalQ10TemperatureRescaleTool.execute;
export default physiologicalQ10TemperatureRescaleTool;
