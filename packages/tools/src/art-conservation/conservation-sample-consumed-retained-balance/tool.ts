import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalMass: number;
  readonly consumedMass: readonly number[];
  readonly transferLoss: number;
};
export type Output = {
  readonly consumedTotal: number;
  readonly retainedMass: number;
  readonly retainedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalMass: { type: "number", exclusiveMinimum: 0 },
    consumedMass: { type: "array", maxItems: 256, items: { type: "number" } },
    transferLoss: { type: "number", minimum: 0 },
  },
  required: ["originalMass", "consumedMass", "transferLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumedTotal: { type: "number" },
    retainedMass: { type: "number" },
    retainedFraction: { type: "number" },
  },
  required: ["consumedTotal", "retainedMass", "retainedFraction"],
} as const;
/** Calculate conservation sample consumed retained balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalMass, consumedMass, transferLoss } = request;
  const compute = (): Output => {
    H.positive(originalMass);
    H.domain(
      consumedMass.every((x) => x >= 0) &&
        transferLoss >= 0 &&
        consumedMass.reduce((a, b) => a + b, 0) + transferLoss <= originalMass,
    );
    return {
      consumedTotal: consumedMass.reduce((a, b) => a + b, 0),
      retainedMass:
        originalMass - consumedMass.reduce((a, b) => a + b, 0) - transferLoss,
      retainedFraction:
        (originalMass -
          consumedMass.reduce((a, b) => a + b, 0) -
          transferLoss) /
        originalMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalMass: 10, consumedMass: [2, 1], transferLoss: 1 },
  output: { consumedTotal: 3, retainedMass: 6, retainedFraction: 0.6 },
} satisfies ToolExample<Input, Output>;
export const conservationSampleConsumedRetainedBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-conservation/conservation-sample-consumed-retained-balance",
      title: "Conservation Sample Consumed Retained Balance Tool",
      description:
        "Calculate conservation sample consumed retained balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalMass: { type: "number", exclusiveMinimum: 0 },
          consumedMass: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          transferLoss: { type: "number", minimum: 0 },
        },
        required: ["originalMass", "consumedMass", "transferLoss"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          consumedTotal: { type: "number" },
          retainedMass: { type: "number" },
          retainedFraction: { type: "number" },
        },
        required: ["consumedTotal", "retainedMass", "retainedFraction"],
      },
      ports: {
        inputs: [
          {
            id: "originalMass",
            label: "Original Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "consumedMass",
            label: "Consumed Mass",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "transferLoss",
            label: "Transfer Loss",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "consumedTotal",
            label: "Consumed Total",
            valueType: { type: "number" },
          },
          {
            id: "retainedMass",
            label: "Retained Mass",
            valueType: { type: "number" },
          },
          {
            id: "retainedFraction",
            label: "Retained Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = conservationSampleConsumedRetainedBalanceTool.execute;
export default conservationSampleConsumedRetainedBalanceTool;
