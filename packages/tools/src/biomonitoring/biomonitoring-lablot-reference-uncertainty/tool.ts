import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly firstUncertainty: number;
  readonly secondUncertainty: number;
  readonly correlation: number;
};
export type Output = {
  readonly difference: number;
  readonly differenceUncertainty: number;
  readonly normalizedDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    firstUncertainty: { type: "number", minimum: 0 },
    secondUncertainty: { type: "number" },
    correlation: { type: "number", minimum: -1 },
  },
  required: [
    "first",
    "second",
    "firstUncertainty",
    "secondUncertainty",
    "correlation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    differenceUncertainty: { type: "number" },
    normalizedDifference: { type: "number" },
  },
  required: ["difference", "differenceUncertainty", "normalizedDifference"],
} as const;
/** Calculate biomonitoring lablot reference uncertainty from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, firstUncertainty, secondUncertainty, correlation } =
    request;
  const compute = (): Output => {
    H.domain(
      firstUncertainty >= 0 && secondUncertainty >= 0,
      "firstUncertainty",
    );
    H.domain(correlation >= -1 && correlation <= 1, "correlation");
    const scale = Math.max(firstUncertainty, secondUncertainty);
    H.domain(scale > 0, "firstUncertainty");
    const a = firstUncertainty / scale,
      b = secondUncertainty / scale,
      differenceUncertainty =
        scale * Math.hypot(a - b, Math.sqrt(2 * (1 - correlation) * a * b));
    H.domain(differenceUncertainty > 0, "correlation");
    return {
      difference: second - first,
      differenceUncertainty,
      normalizedDifference: (second - first) / differenceUncertainty,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    first: 10,
    second: 12,
    firstUncertainty: 1,
    secondUncertainty: 1,
    correlation: 0,
  },
  output: {
    difference: 2,
    differenceUncertainty: 1.4142135623730951,
    normalizedDifference: 1.414213562373095,
  },
} satisfies ToolExample<Input, Output>;
export const biomonitoringLablotReferenceUncertaintyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biomonitoring/biomonitoring-lablot-reference-uncertainty",
      title: "Biomonitoring Lablot Reference Uncertainty Tool",
      description:
        "Calculate biomonitoring lablot reference uncertainty from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "number" },
          second: { type: "number" },
          firstUncertainty: { type: "number", minimum: 0 },
          secondUncertainty: { type: "number" },
          correlation: { type: "number", minimum: -1 },
        },
        required: [
          "first",
          "second",
          "firstUncertainty",
          "secondUncertainty",
          "correlation",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          difference: { type: "number" },
          differenceUncertainty: { type: "number" },
          normalizedDifference: { type: "number" },
        },
        required: [
          "difference",
          "differenceUncertainty",
          "normalizedDifference",
        ],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstUncertainty",
            label: "First Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondUncertainty",
            label: "Second Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "correlation",
            label: "Correlation",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "difference",
            label: "Difference",
            valueType: { type: "number" },
          },
          {
            id: "differenceUncertainty",
            label: "Difference Uncertainty",
            valueType: { type: "number" },
          },
          {
            id: "normalizedDifference",
            label: "Normalized Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biomonitoringLablotReferenceUncertaintyTool.execute;
export default biomonitoringLablotReferenceUncertaintyTool;
