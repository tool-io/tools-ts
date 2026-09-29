import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalLength: number;
  readonly forkLength: number;
  readonly standardLength: number;
};
export type Output = {
  readonly notchDifference: number;
  readonly caudalExtension: number;
  readonly forkStandardDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalLength: { type: "number" },
    forkLength: { type: "number" },
    standardLength: { type: "number", minimum: 0 },
  },
  required: ["totalLength", "forkLength", "standardLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    notchDifference: { type: "number" },
    caudalExtension: { type: "number" },
    forkStandardDifference: { type: "number" },
  },
  required: ["notchDifference", "caudalExtension", "forkStandardDifference"],
} as const;
/** Calculate fish caudal notch length difference term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalLength, forkLength, standardLength } = request;
  const compute = (): Output => {
    H.domain(
      totalLength >= forkLength &&
        forkLength >= standardLength &&
        standardLength >= 0,
    );
    return {
      notchDifference: totalLength - forkLength,
      caudalExtension: totalLength - standardLength,
      forkStandardDifference: forkLength - standardLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalLength: 120, forkLength: 110, standardLength: 95 },
  output: {
    notchDifference: 10,
    caudalExtension: 25,
    forkStandardDifference: 15,
  },
} satisfies ToolExample<Input, Output>;
export const fishCaudalNotchLengthDifferenceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ichthyology/fish-caudal-notch-length-difference-term",
      title: "Fish Caudal Notch Length Difference Term Tool",
      description:
        "Calculate fish caudal notch length difference term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalLength: { type: "number" },
          forkLength: { type: "number" },
          standardLength: { type: "number", minimum: 0 },
        },
        required: ["totalLength", "forkLength", "standardLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          notchDifference: { type: "number" },
          caudalExtension: { type: "number" },
          forkStandardDifference: { type: "number" },
        },
        required: [
          "notchDifference",
          "caudalExtension",
          "forkStandardDifference",
        ],
      },
      ports: {
        inputs: [
          {
            id: "totalLength",
            label: "Total Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "forkLength",
            label: "Fork Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "standardLength",
            label: "Standard Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "notchDifference",
            label: "Notch Difference",
            valueType: { type: "number" },
          },
          {
            id: "caudalExtension",
            label: "Caudal Extension",
            valueType: { type: "number" },
          },
          {
            id: "forkStandardDifference",
            label: "Fork Standard Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fishCaudalNotchLengthDifferenceTermTool.execute;
export default fishCaudalNotchLengthDifferenceTermTool;
