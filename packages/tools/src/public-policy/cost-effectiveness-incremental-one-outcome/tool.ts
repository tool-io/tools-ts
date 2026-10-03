import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly newCost: number;
  readonly oldCost: number;
  readonly newOutcome: number;
  readonly oldOutcome: number;
};
export type Output = {
  readonly incrementalCost: number;
  readonly incrementalOutcome: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newCost: { type: "number" },
    oldCost: { type: "number" },
    newOutcome: { type: "number" },
    oldOutcome: { type: "number" },
  },
  required: ["newCost", "oldCost", "newOutcome", "oldOutcome"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incrementalCost: { type: "number" },
    incrementalOutcome: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["incrementalCost", "incrementalOutcome", "ratio"],
} as const;
/** Incremental cost per supplied outcome unit; signed ratios alone do not determine a policy decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { newCost, oldCost, newOutcome, oldOutcome } = request;
  const compute = (): Output => {
    H.domain(newOutcome !== oldOutcome);
    return {
      incrementalCost: newCost - oldCost,
      incrementalOutcome: newOutcome - oldOutcome,
      ratio: (newCost - oldCost) / (newOutcome - oldOutcome),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { newCost: 1200, oldCost: 1000, newOutcome: 30, oldOutcome: 20 },
  output: { incrementalCost: 200, incrementalOutcome: 10, ratio: 20 },
} satisfies ToolExample<Input, Output>;
export const costEffectivenessIncrementalOneOutcomeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-policy/cost-effectiveness-incremental-one-outcome",
      title: "Cost Effectiveness Incremental One Outcome Tool",
      description:
        "Incremental cost per supplied outcome unit; signed ratios alone do not determine a policy decision.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          newCost: { type: "number" },
          oldCost: { type: "number" },
          newOutcome: { type: "number" },
          oldOutcome: { type: "number" },
        },
        required: ["newCost", "oldCost", "newOutcome", "oldOutcome"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          incrementalCost: { type: "number" },
          incrementalOutcome: { type: "number" },
          ratio: { type: "number" },
        },
        required: ["incrementalCost", "incrementalOutcome", "ratio"],
      },
      ports: {
        inputs: [
          {
            id: "newCost",
            label: "New Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oldCost",
            label: "Old Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newOutcome",
            label: "New Outcome",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oldOutcome",
            label: "Old Outcome",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "incrementalCost",
            label: "Incremental Cost",
            valueType: { type: "number" },
          },
          {
            id: "incrementalOutcome",
            label: "Incremental Outcome",
            valueType: { type: "number" },
          },
          { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = costEffectivenessIncrementalOneOutcomeTool.execute;
export default costEffectivenessIncrementalOneOutcomeTool;
