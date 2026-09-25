import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly population: readonly number[];
  readonly workerWeights: readonly number[];
  readonly consumerWeights: readonly number[];
};
export type Output = {
  readonly effectiveWorkers: number;
  readonly effectiveConsumers: number;
  readonly supportRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "array", maxItems: 256, items: { type: "number" } },
    workerWeights: { type: "array", maxItems: 256, items: { type: "number" } },
    consumerWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["population", "workerWeights", "consumerWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveWorkers: { type: "number" },
    effectiveConsumers: { type: "number" },
    supportRatio: { type: "number" },
  },
  required: ["effectiveWorkers", "effectiveConsumers", "supportRatio"],
} as const;
/** Calculate support ratio effective workers consumers from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { population, workerWeights, consumerWeights } = request;
  const compute = (): Output => {
    H.sameLength(population, workerWeights);
    H.sameLength(population, consumerWeights);
    H.domain(
      [...population, ...workerWeights, ...consumerWeights].every(
        (x) => x >= 0,
      ),
    );
    H.positive(H.dot(population, consumerWeights));
    return {
      effectiveWorkers: H.dot(population, workerWeights),
      effectiveConsumers: H.dot(population, consumerWeights),
      supportRatio:
        H.dot(population, workerWeights) / H.dot(population, consumerWeights),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    population: [100, 200],
    workerWeights: [0, 1],
    consumerWeights: [0.5, 1],
  },
  output: { effectiveWorkers: 200, effectiveConsumers: 250, supportRatio: 0.8 },
} satisfies ToolExample<Input, Output>;
export const supportRatioEffectiveWorkersConsumersTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "demographic-economics/support-ratio-effective-workers-consumers",
      title: "Support Ratio Effective Workers Consumers Tool",
      description:
        "Calculate support ratio effective workers consumers from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          population: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          workerWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          consumerWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["population", "workerWeights", "consumerWeights"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effectiveWorkers: { type: "number" },
          effectiveConsumers: { type: "number" },
          supportRatio: { type: "number" },
        },
        required: ["effectiveWorkers", "effectiveConsumers", "supportRatio"],
      },
      ports: {
        inputs: [
          {
            id: "population",
            label: "Population",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "workerWeights",
            label: "Worker Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "consumerWeights",
            label: "Consumer Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "effectiveWorkers",
            label: "Effective Workers",
            valueType: { type: "number" },
          },
          {
            id: "effectiveConsumers",
            label: "Effective Consumers",
            valueType: { type: "number" },
          },
          {
            id: "supportRatio",
            label: "Support Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = supportRatioEffectiveWorkersConsumersTool.execute;
export default supportRatioEffectiveWorkersConsumersTool;
