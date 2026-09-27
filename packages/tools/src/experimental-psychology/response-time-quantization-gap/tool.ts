import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseTime: number;
  readonly firstQuantum: number;
  readonly secondQuantum: number;
};
export type Output = {
  readonly firstQuantized: number;
  readonly secondQuantized: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseTime: { type: "number" },
    firstQuantum: { type: "number", exclusiveMinimum: 0 },
    secondQuantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["responseTime", "firstQuantum", "secondQuantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstQuantized: { type: "number" },
    secondQuantized: { type: "number" },
    difference: { type: "number" },
  },
  required: ["firstQuantized", "secondQuantized", "difference"],
} as const;
/** Compare nearest-quantum response-time recordings under two explicit resolutions, with ties toward positive infinity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseTime, firstQuantum, secondQuantum } = request;
  const compute = (): Output => {
    H.positive(firstQuantum);
    H.positive(secondQuantum);
    return (() => {
      const firstQuantized =
          Math.round(responseTime / firstQuantum) * firstQuantum,
        secondQuantized =
          Math.round(responseTime / secondQuantum) * secondQuantum;
      return {
        firstQuantized,
        secondQuantized,
        difference: secondQuantized - firstQuantized,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseTime: 1.3, firstQuantum: 1, secondQuantum: 0.5 },
  output: { firstQuantized: 1, secondQuantized: 1.5, difference: 0.5 },
} satisfies ToolExample<Input, Output>;
export const responseTimeQuantizationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/response-time-quantization-gap",
    title: "Response Time Quantization Gap Tool",
    description:
      "Compare nearest-quantum response-time recordings under two explicit resolutions, with ties toward positive infinity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseTime: { type: "number" },
        firstQuantum: { type: "number", exclusiveMinimum: 0 },
        secondQuantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["responseTime", "firstQuantum", "secondQuantum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstQuantized: { type: "number" },
        secondQuantized: { type: "number" },
        difference: { type: "number" },
      },
      required: ["firstQuantized", "secondQuantized", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "responseTime",
          label: "Response Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstQuantum",
          label: "First Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondQuantum",
          label: "Second Quantum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstQuantized",
          label: "First Quantized",
          valueType: { type: "number" },
        },
        {
          id: "secondQuantized",
          label: "Second Quantized",
          valueType: { type: "number" },
        },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = responseTimeQuantizationGapTool.execute;
export default responseTimeQuantizationGapTool;
