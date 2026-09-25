import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly consumerWeight: number;
  readonly referenceCount: number;
};
export type Output = {
  readonly equivalentConsumers: number;
  readonly contributionPerReference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    consumerWeight: { type: "number", minimum: 0 },
    referenceCount: { type: "integer", minimum: 1 },
  },
  required: ["count", "consumerWeight", "referenceCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalentConsumers: { type: "number" },
    contributionPerReference: { type: "number" },
  },
  required: ["equivalentConsumers", "contributionPerReference"],
} as const;
/** Calculate equivalent consumer age weight term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, consumerWeight, referenceCount } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.domain(consumerWeight >= 0);
    H.integer(referenceCount, 1);
    return {
      equivalentConsumers: count * consumerWeight,
      contributionPerReference: (count * consumerWeight) / referenceCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 100, consumerWeight: 0.6, referenceCount: 200 },
  output: { equivalentConsumers: 60, contributionPerReference: 0.3 },
} satisfies ToolExample<Input, Output>;
export const equivalentConsumerAgeWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/equivalent-consumer-age-weight-term",
    title: "Equivalent Consumer Age Weight Term Tool",
    description:
      "Calculate equivalent consumer age weight term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        consumerWeight: { type: "number", minimum: 0 },
        referenceCount: { type: "integer", minimum: 1 },
      },
      required: ["count", "consumerWeight", "referenceCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equivalentConsumers: { type: "number" },
        contributionPerReference: { type: "number" },
      },
      required: ["equivalentConsumers", "contributionPerReference"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "consumerWeight",
          label: "Consumer Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceCount",
          label: "Reference Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "equivalentConsumers",
          label: "Equivalent Consumers",
          valueType: { type: "number" },
        },
        {
          id: "contributionPerReference",
          label: "Contribution Per Reference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = equivalentConsumerAgeWeightTermTool.execute;
export default equivalentConsumerAgeWeightTermTool;
