import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localServices: number;
  readonly localPopulation: number;
  readonly benchmarkPerBase: number;
  readonly basePopulation: number;
};
export type Output = {
  readonly localPerBase: number;
  readonly gap: number;
  readonly servicesForBenchmark: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localServices: { type: "number", minimum: 0 },
    localPopulation: { type: "number", exclusiveMinimum: 0 },
    benchmarkPerBase: { type: "number", minimum: 0 },
    basePopulation: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "localServices",
    "localPopulation",
    "benchmarkPerBase",
    "basePopulation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localPerBase: { type: "number" },
    gap: { type: "number" },
    servicesForBenchmark: { type: "number" },
  },
  required: ["localPerBase", "gap", "servicesForBenchmark"],
} as const;
/** Calculate neighborhood service per capita gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localServices, localPopulation, benchmarkPerBase, basePopulation } =
    request;
  const compute = (): Output => {
    H.domain(localServices >= 0 && benchmarkPerBase >= 0);
    H.positive(localPopulation);
    H.positive(basePopulation);
    return {
      localPerBase: (localServices * basePopulation) / localPopulation,
      gap:
        (localServices * basePopulation) / localPopulation - benchmarkPerBase,
      servicesForBenchmark:
        (localPopulation * benchmarkPerBase) / basePopulation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    localServices: 4,
    localPopulation: 2000,
    benchmarkPerBase: 3,
    basePopulation: 1000,
  },
  output: { localPerBase: 2, gap: -1, servicesForBenchmark: 6 },
} satisfies ToolExample<Input, Output>;
export const neighborhoodServicePerCapitaGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/neighborhood-service-per-capita-gap",
    title: "Neighborhood Service Per Capita Gap Tool",
    description:
      "Calculate neighborhood service per capita gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localServices: { type: "number", minimum: 0 },
        localPopulation: { type: "number", exclusiveMinimum: 0 },
        benchmarkPerBase: { type: "number", minimum: 0 },
        basePopulation: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "localServices",
        "localPopulation",
        "benchmarkPerBase",
        "basePopulation",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localPerBase: { type: "number" },
        gap: { type: "number" },
        servicesForBenchmark: { type: "number" },
      },
      required: ["localPerBase", "gap", "servicesForBenchmark"],
    },
    ports: {
      inputs: [
        {
          id: "localServices",
          label: "Local Services",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "localPopulation",
          label: "Local Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "benchmarkPerBase",
          label: "Benchmark Per Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basePopulation",
          label: "Base Population",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "localPerBase",
          label: "Local Per Base",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "servicesForBenchmark",
          label: "Services For Benchmark",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = neighborhoodServicePerCapitaGapTool.execute;
export default neighborhoodServicePerCapitaGapTool;
