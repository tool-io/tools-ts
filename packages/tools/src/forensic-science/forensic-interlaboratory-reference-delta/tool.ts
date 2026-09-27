import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly firstUncertainty: number;
  readonly secondUncertainty: number;
};
export type Output = {
  readonly difference: number;
  readonly normalizedDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    firstUncertainty: { type: "number", minimum: 0 },
    secondUncertainty: { type: "number", minimum: 0 },
  },
  required: ["first", "second", "firstUncertainty", "secondUncertainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    normalizedDifference: { type: "number" },
  },
  required: ["difference", "normalizedDifference"],
} as const;
/** Independent-uncertainty normalized interlaboratory difference, with matching uncertainty coverage conventions required. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, firstUncertainty, secondUncertainty } = request;
  const compute = (): Output => {
    H.domain(
      firstUncertainty >= 0 &&
        secondUncertainty >= 0 &&
        firstUncertainty + secondUncertainty > 0,
    );
    return {
      difference: first - second,
      normalizedDifference:
        (first - second) / Math.hypot(firstUncertainty, secondUncertainty),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 105, second: 100, firstUncertainty: 3, secondUncertainty: 4 },
  output: { difference: 5, normalizedDifference: 1 },
} satisfies ToolExample<Input, Output>;
export const forensicInterlaboratoryReferenceDeltaTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "forensic-science/forensic-interlaboratory-reference-delta",
      title: "Forensic Interlaboratory Reference Delta Tool",
      description:
        "Independent-uncertainty normalized interlaboratory difference, with matching uncertainty coverage conventions required.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "number" },
          second: { type: "number" },
          firstUncertainty: { type: "number", minimum: 0 },
          secondUncertainty: { type: "number", minimum: 0 },
        },
        required: ["first", "second", "firstUncertainty", "secondUncertainty"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          difference: { type: "number" },
          normalizedDifference: { type: "number" },
        },
        required: ["difference", "normalizedDifference"],
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
        ],
        outputs: [
          {
            id: "difference",
            label: "Difference",
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
export const run = forensicInterlaboratoryReferenceDeltaTool.execute;
export default forensicInterlaboratoryReferenceDeltaTool;
