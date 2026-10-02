import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initial: number;
  readonly retainedFraction: number;
};
export type Output = { readonly retained: number; readonly removed: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initial: { type: "number", minimum: 0 },
    retainedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["initial", "retainedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { retained: { type: "number" }, removed: { type: "number" } },
  required: ["retained", "removed"],
} as const;
/** Calculate fractional retention removed share amount from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initial, retainedFraction } = request;
  const compute = (): Output => {
    H.domain(initial >= 0);
    H.probability(retainedFraction);
    const retained = initial * retainedFraction;
    return { retained, removed: initial - retained };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initial: 100, retainedFraction: 0.8 },
  output: { retained: 80, removed: 20 },
} satisfies ToolExample<Input, Output>;
export const fractionalRetentionRemovedShareAmountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/fractional-retention-removed-share-amount",
      title: "Fractional Retention Removed Share Amount Tool",
      description:
        "Calculate fractional retention removed share amount from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initial: { type: "number", minimum: 0 },
          retainedFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["initial", "retainedFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retained: { type: "number" },
          removed: { type: "number" },
        },
        required: ["retained", "removed"],
      },
      ports: {
        inputs: [
          {
            id: "initial",
            label: "Initial",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retainedFraction",
            label: "Retained Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "retained", label: "Retained", valueType: { type: "number" } },
          { id: "removed", label: "Removed", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = fractionalRetentionRemovedShareAmountTool.execute;
export default fractionalRetentionRemovedShareAmountTool;
