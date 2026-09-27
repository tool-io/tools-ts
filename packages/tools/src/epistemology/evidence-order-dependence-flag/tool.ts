import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly posteriorFirstOrder: number;
  readonly posteriorSecondOrder: number;
  readonly tolerance: number;
};
export type Output = { readonly gap: number; readonly differs: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    posteriorFirstOrder: { type: "number", minimum: 0, maximum: 1 },
    posteriorSecondOrder: { type: "number", minimum: 0, maximum: 1 },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["posteriorFirstOrder", "posteriorSecondOrder", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, differs: { type: "boolean" } },
  required: ["gap", "differs"],
} as const;
/** Audit two supplied posterior results; no independence assumption or updating algorithm is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { posteriorFirstOrder, posteriorSecondOrder, tolerance } = request;
  const compute = (): Output => {
    H.probability(posteriorFirstOrder);
    H.probability(posteriorSecondOrder);
    H.domain(tolerance >= 0);
    return {
      gap: posteriorFirstOrder - posteriorSecondOrder,
      differs: Math.abs(posteriorFirstOrder - posteriorSecondOrder) > tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    posteriorFirstOrder: 0.6,
    posteriorSecondOrder: 0.5,
    tolerance: 0.05,
  },
  output: { gap: 0.09999999999999998, differs: true },
} satisfies ToolExample<Input, Output>;
export const evidenceOrderDependenceFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/evidence-order-dependence-flag",
    title: "Evidence Order Dependence Flag Tool",
    description:
      "Audit two supplied posterior results; no independence assumption or updating algorithm is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        posteriorFirstOrder: { type: "number", minimum: 0, maximum: 1 },
        posteriorSecondOrder: { type: "number", minimum: 0, maximum: 1 },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["posteriorFirstOrder", "posteriorSecondOrder", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, differs: { type: "boolean" } },
      required: ["gap", "differs"],
    },
    ports: {
      inputs: [
        {
          id: "posteriorFirstOrder",
          label: "Posterior First Order",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "posteriorSecondOrder",
          label: "Posterior Second Order",
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
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "differs", label: "Differs", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = evidenceOrderDependenceFlagTool.execute;
export default evidenceOrderDependenceFlagTool;
