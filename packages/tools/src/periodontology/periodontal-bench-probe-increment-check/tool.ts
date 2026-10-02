import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reading: number;
  readonly zero: number;
  readonly increment: number;
  readonly tolerance: number;
};
export type Output = {
  readonly nearestIndex: number;
  readonly reconstructed: number;
  readonly residual: number;
  readonly aligned: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reading: { type: "number" },
    zero: { type: "number" },
    increment: { type: "number", exclusiveMinimum: 0 },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["reading", "zero", "increment", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nearestIndex: { type: "integer" },
    reconstructed: { type: "number" },
    residual: { type: "number" },
    aligned: { type: "boolean" },
  },
  required: ["nearestIndex", "reconstructed", "residual", "aligned"],
} as const;
/** Audit an explicit bench probe reading against a supplied increment grid. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reading, zero, increment, tolerance } = request;
  const compute = (): Output => {
    H.positive(increment);
    H.domain(tolerance >= 0);
    return {
      nearestIndex: Math.round((reading - zero) / increment),
      reconstructed:
        zero + Math.round((reading - zero) / increment) * increment,
      residual:
        reading - zero - Math.round((reading - zero) / increment) * increment,
      aligned:
        Math.abs(
          reading - zero - Math.round((reading - zero) / increment) * increment,
        ) <= tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reading: 2.1, zero: 0, increment: 0.5, tolerance: 0.11 },
  output: {
    nearestIndex: 4,
    reconstructed: 2,
    residual: 0.10000000000000009,
    aligned: true,
  },
} satisfies ToolExample<Input, Output>;
export const periodontalBenchProbeIncrementCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "periodontology/periodontal-bench-probe-increment-check",
      title: "Periodontal Bench Probe Increment Check Tool",
      description:
        "Audit an explicit bench probe reading against a supplied increment grid.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reading: { type: "number" },
          zero: { type: "number" },
          increment: { type: "number", exclusiveMinimum: 0 },
          tolerance: { type: "number", minimum: 0 },
        },
        required: ["reading", "zero", "increment", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nearestIndex: { type: "integer" },
          reconstructed: { type: "number" },
          residual: { type: "number" },
          aligned: { type: "boolean" },
        },
        required: ["nearestIndex", "reconstructed", "residual", "aligned"],
      },
      ports: {
        inputs: [
          {
            id: "reading",
            label: "Reading",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "zero",
            label: "Zero",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "increment",
            label: "Increment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tolerance",
            label: "Tolerance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "nearestIndex",
            label: "Nearest Index",
            valueType: { type: "integer" },
          },
          {
            id: "reconstructed",
            label: "Reconstructed",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
          { id: "aligned", label: "Aligned", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = periodontalBenchProbeIncrementCheckTool.execute;
export default periodontalBenchProbeIncrementCheckTool;
