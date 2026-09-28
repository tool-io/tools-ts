import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly suppliedBoundary: number;
  readonly quantum: number;
  readonly floorBoundary: boolean;
};
export type Output = {
  readonly quantizedBoundary: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number" },
    suppliedBoundary: { type: "number" },
    quantum: { type: "number", exclusiveMinimum: 0 },
    floorBoundary: { type: "boolean" },
  },
  required: ["measured", "suppliedBoundary", "quantum", "floorBoundary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantizedBoundary: { type: "number" },
    gap: { type: "number" },
  },
  required: ["quantizedBoundary", "gap"],
} as const;
/** Compare a supplied measurement with an explicitly floored/ceiled resolution-grid boundary; no clinical cutoff is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, suppliedBoundary, quantum, floorBoundary } = request;
  const compute = (): Output => {
    H.positive(quantum);
    return {
      quantizedBoundary:
        (floorBoundary
          ? Math.floor(suppliedBoundary / quantum)
          : Math.ceil(suppliedBoundary / quantum)) * quantum,
      gap:
        measured -
        (floorBoundary
          ? Math.floor(suppliedBoundary / quantum)
          : Math.ceil(suppliedBoundary / quantum)) *
          quantum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measured: 5,
    suppliedBoundary: 4.5,
    quantum: 1,
    floorBoundary: true,
  },
  output: { quantizedBoundary: 4, gap: 1 },
} satisfies ToolExample<Input, Output>;
export const measurementBoundaryRoundingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/measurement-boundary-rounding-gap",
    title: "Measurement Boundary Rounding Gap Tool",
    description:
      "Compare a supplied measurement with an explicitly floored/ceiled resolution-grid boundary; no clinical cutoff is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measured: { type: "number" },
        suppliedBoundary: { type: "number" },
        quantum: { type: "number", exclusiveMinimum: 0 },
        floorBoundary: { type: "boolean" },
      },
      required: ["measured", "suppliedBoundary", "quantum", "floorBoundary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantizedBoundary: { type: "number" },
        gap: { type: "number" },
      },
      required: ["quantizedBoundary", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBoundary",
          label: "Supplied Boundary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "floorBoundary",
          label: "Floor Boundary",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "quantizedBoundary",
          label: "Quantized Boundary",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = measurementBoundaryRoundingGapTool.execute;
export default measurementBoundaryRoundingGapTool;
