import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assignedWeights: readonly number[];
  readonly desiredTotal: number;
};
export type Output = { readonly assigned: number; readonly remaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assignedWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    desiredTotal: { type: "number", minimum: 0 },
  },
  required: ["assignedWeights", "desiredTotal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { assigned: { type: "number" }, remaining: { type: "number" } },
  required: ["assigned", "remaining"],
} as const;
/** Calculate art rubric criterion weight residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assignedWeights, desiredTotal } = request;
  const compute = (): Output => {
    H.domain(assignedWeights.every((x) => x >= 0) && desiredTotal >= 0);
    return {
      assigned: assignedWeights.reduce((a, b) => a + b, 0),
      remaining: desiredTotal - assignedWeights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assignedWeights: [20, 30, 25], desiredTotal: 100 },
  output: { assigned: 75, remaining: 25 },
} satisfies ToolExample<Input, Output>;
export const artRubricCriterionWeightResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/art-rubric-criterion-weight-residual",
    title: "Art Rubric Criterion Weight Residual Tool",
    description:
      "Calculate art rubric criterion weight residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assignedWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        desiredTotal: { type: "number", minimum: 0 },
      },
      required: ["assignedWeights", "desiredTotal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assigned: { type: "number" },
        remaining: { type: "number" },
      },
      required: ["assigned", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "assignedWeights",
          label: "Assigned Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "desiredTotal",
          label: "Desired Total",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "assigned", label: "Assigned", valueType: { type: "number" } },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = artRubricCriterionWeightResidualTool.execute;
export default artRubricCriterionWeightResidualTool;
