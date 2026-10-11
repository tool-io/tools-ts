import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalUnits: number;
  readonly shareFraction: number;
  readonly quantumUnits: number;
};
export type Output = {
  readonly idealUnits: number;
  readonly nearestQuantumUnits: number;
  readonly signedRoundingError: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalUnits: { type: "integer", minimum: 0 },
    shareFraction: { type: "number", minimum: 0, maximum: 1 },
    quantumUnits: { type: "integer", minimum: 1 },
  },
  required: ["totalUnits", "shareFraction", "quantumUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idealUnits: { type: "number" },
    nearestQuantumUnits: { type: "integer" },
    signedRoundingError: { type: "number" },
  },
  required: ["idealUnits", "nearestQuantumUnits", "signedRoundingError"],
} as const;
/** Quantize an explicit fractional allocation to the nearest integer quantum with half ties upward and retain the signed rounding error. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalUnits, shareFraction, quantumUnits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalUnits) &&
        totalUnits >= 0 &&
        totalUnits <= Number.MAX_SAFE_INTEGER,
      "totalUnits",
    ),
      totalUnits);
    (H.domain(shareFraction >= 0 && shareFraction <= 1, "shareFraction"),
      shareFraction);
    (H.domain(
      Number.isSafeInteger(quantumUnits) &&
        quantumUnits >= 1 &&
        quantumUnits <= Number.MAX_SAFE_INTEGER,
      "quantumUnits",
    ),
      quantumUnits);
    return (() => {
      const idealUnits = totalUnits * shareFraction,
        nearestQuantumUnits =
          Math.round(idealUnits / quantumUnits) * quantumUnits;
      return {
        idealUnits,
        nearestQuantumUnits,
        signedRoundingError: nearestQuantumUnits - idealUnits,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalUnits: 101, shareFraction: 0.25, quantumUnits: 5 },
  output: {
    idealUnits: 25.25,
    nearestQuantumUnits: 25,
    signedRoundingError: -0.25,
  },
} satisfies ToolExample<Input, Output>;
export const fractionalShareIntegerQuantumErrorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["proportions", "mathematics"],
      keywords: ["proportions", "mathematics"],
    },
    id: "proportions/fractional-share-integer-quantum-error",
    title: "Fractional Share Integer Quantum Error",
    description:
      "Quantize an explicit fractional allocation to the nearest integer quantum with half ties upward and retain the signed rounding error.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalUnits: { type: "integer", minimum: 0 },
        shareFraction: { type: "number", minimum: 0, maximum: 1 },
        quantumUnits: { type: "integer", minimum: 1 },
      },
      required: ["totalUnits", "shareFraction", "quantumUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        idealUnits: { type: "number" },
        nearestQuantumUnits: { type: "integer" },
        signedRoundingError: { type: "number" },
      },
      required: ["idealUnits", "nearestQuantumUnits", "signedRoundingError"],
    },
    ports: {
      inputs: [
        {
          id: "totalUnits",
          label: "Total Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "shareFraction",
          label: "Share Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantumUnits",
          label: "Quantum Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "idealUnits",
          label: "Ideal Units",
          valueType: { type: "number" },
        },
        {
          id: "nearestQuantumUnits",
          label: "Nearest Quantum Units",
          valueType: { type: "integer" },
        },
        {
          id: "signedRoundingError",
          label: "Signed Rounding Error",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fractionalShareIntegerQuantumErrorTool.execute;
export default fractionalShareIntegerQuantumErrorTool;
