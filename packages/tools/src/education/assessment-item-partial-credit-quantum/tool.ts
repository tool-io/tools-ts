import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earnedPoints: number;
  readonly maximumPoints: number;
  readonly creditQuantum: number;
};
export type Output = {
  readonly quantizedPoints: number;
  readonly quantizedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earnedPoints: { type: "number", minimum: 0 },
    maximumPoints: { type: "number", exclusiveMinimum: 0 },
    creditQuantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["earnedPoints", "maximumPoints", "creditQuantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantizedPoints: { type: "number" },
    quantizedFraction: { type: "number" },
  },
  required: ["quantizedPoints", "quantizedFraction"],
} as const;
/** Round explicit earned item points down to a supplied partial-credit quantum without selecting an assessment policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earnedPoints, maximumPoints, creditQuantum } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(maximumPoints) && maximumPoints > 0,
      "maximumPoints",
    ),
      maximumPoints);
    H.domain(
      earnedPoints >= 0 && earnedPoints <= maximumPoints,
      "earnedPoints",
    );
    (H.domain(
      Number.isFinite(creditQuantum) && creditQuantum > 0,
      "creditQuantum",
    ),
      creditQuantum);
    return (() => {
      const quantizedPoints =
        Math.floor(earnedPoints / creditQuantum) * creditQuantum;
      return {
        quantizedPoints,
        quantizedFraction: quantizedPoints / maximumPoints,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earnedPoints: 3.7, maximumPoints: 5, creditQuantum: 0.5 },
  output: { quantizedPoints: 3.5, quantizedFraction: 0.7 },
} satisfies ToolExample<Input, Output>;
export const assessmentItemPartialCreditQuantumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["education"],
      keywords: ["education"],
    },
    id: "education/assessment-item-partial-credit-quantum",
    title: "Assessment Item Partial Credit Quantum",
    description:
      "Round explicit earned item points down to a supplied partial-credit quantum without selecting an assessment policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earnedPoints: { type: "number", minimum: 0 },
        maximumPoints: { type: "number", exclusiveMinimum: 0 },
        creditQuantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["earnedPoints", "maximumPoints", "creditQuantum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantizedPoints: { type: "number" },
        quantizedFraction: { type: "number" },
      },
      required: ["quantizedPoints", "quantizedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "earnedPoints",
          label: "Earned Points",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumPoints",
          label: "Maximum Points",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditQuantum",
          label: "Credit Quantum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "quantizedPoints",
          label: "Quantized Points",
          valueType: { type: "number" },
        },
        {
          id: "quantizedFraction",
          label: "Quantized Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assessmentItemPartialCreditQuantumTool.execute;
export default assessmentItemPartialCreditQuantumTool;
