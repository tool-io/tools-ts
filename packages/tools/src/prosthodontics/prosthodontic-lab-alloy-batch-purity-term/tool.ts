import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly impurityFraction: number;
  readonly targetPureMass: number;
  readonly recovery: number;
};
export type Output = {
  readonly pureMass: number;
  readonly recoverablePureMass: number;
  readonly grossRequired: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", minimum: 0 },
    impurityFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    targetPureMass: { type: "number", minimum: 0 },
    recovery: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["grossMass", "impurityFraction", "targetPureMass", "recovery"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pureMass: { type: "number" },
    recoverablePureMass: { type: "number" },
    grossRequired: { type: "number" },
  },
  required: ["pureMass", "recoverablePureMass", "grossRequired"],
} as const;
/** Calculate prosthodontic lab alloy batch purity term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, impurityFraction, targetPureMass, recovery } = request;
  const compute = (): Output => {
    H.domain(
      grossMass >= 0 &&
        targetPureMass >= 0 &&
        impurityFraction >= 0 &&
        impurityFraction < 1 &&
        recovery > 0 &&
        recovery <= 1,
    );
    return {
      pureMass: grossMass * (1 - impurityFraction),
      recoverablePureMass: grossMass * (1 - impurityFraction) * recovery,
      grossRequired: targetPureMass / ((1 - impurityFraction) * recovery),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossMass: 100,
    impurityFraction: 0.1,
    targetPureMass: 36,
    recovery: 0.8,
  },
  output: {
    pureMass: 90,
    recoverablePureMass: 72,
    grossRequired: 49.99999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const prosthodonticLabAlloyBatchPurityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "prosthodontics/prosthodontic-lab-alloy-batch-purity-term",
      title: "Prosthodontic Lab Alloy Batch Purity Term Tool",
      description:
        "Calculate prosthodontic lab alloy batch purity term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossMass: { type: "number", minimum: 0 },
          impurityFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
          targetPureMass: { type: "number", minimum: 0 },
          recovery: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        },
        required: [
          "grossMass",
          "impurityFraction",
          "targetPureMass",
          "recovery",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pureMass: { type: "number" },
          recoverablePureMass: { type: "number" },
          grossRequired: { type: "number" },
        },
        required: ["pureMass", "recoverablePureMass", "grossRequired"],
      },
      ports: {
        inputs: [
          {
            id: "grossMass",
            label: "Gross Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "impurityFraction",
            label: "Impurity Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetPureMass",
            label: "Target Pure Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recovery",
            label: "Recovery",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "pureMass", label: "Pure Mass", valueType: { type: "number" } },
          {
            id: "recoverablePureMass",
            label: "Recoverable Pure Mass",
            valueType: { type: "number" },
          },
          {
            id: "grossRequired",
            label: "Gross Required",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = prosthodonticLabAlloyBatchPurityTermTool.execute;
export default prosthodonticLabAlloyBatchPurityTermTool;
