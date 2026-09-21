import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workers: number;
  readonly nights: number;
  readonly nightlyCost: number;
  readonly employerFraction: number;
  readonly fixedCost: number;
};
export type Output = {
  readonly grossCost: number;
  readonly employerCost: number;
  readonly workerTotal: number;
  readonly perWorker: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workers: { type: "integer", minimum: 1 },
    nights: { type: "integer", minimum: 0 },
    nightlyCost: { type: "number", minimum: 0 },
    employerFraction: { type: "number", minimum: 0, maximum: 1 },
    fixedCost: { type: "number", minimum: 0 },
  },
  required: [
    "workers",
    "nights",
    "nightlyCost",
    "employerFraction",
    "fixedCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossCost: { type: "number" },
    employerCost: { type: "number" },
    workerTotal: { type: "number" },
    perWorker: { type: "number" },
  },
  required: ["grossCost", "employerCost", "workerTotal", "perWorker"],
} as const;
/** Calculate seasonal labor accommodation cost share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workers, nights, nightlyCost, employerFraction, fixedCost } = request;
  const compute = (): Output => {
    H.integer(workers, 1);
    H.integer(nights, 0);
    H.domain(nightlyCost >= 0 && fixedCost >= 0);
    H.probability(employerFraction);
    return {
      grossCost: workers * nights * nightlyCost + fixedCost,
      employerCost:
        (workers * nights * nightlyCost + fixedCost) * employerFraction,
      workerTotal:
        (workers * nights * nightlyCost + fixedCost) * (1 - employerFraction),
      perWorker:
        ((workers * nights * nightlyCost + fixedCost) *
          (1 - employerFraction)) /
        workers,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    workers: 10,
    nights: 5,
    nightlyCost: 20,
    employerFraction: 0.5,
    fixedCost: 100,
  },
  output: {
    grossCost: 1100,
    employerCost: 550,
    workerTotal: 550,
    perWorker: 55,
  },
} satisfies ToolExample<Input, Output>;
export const seasonalLaborAccommodationCostShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agribusiness/seasonal-labor-accommodation-cost-share",
      title: "Seasonal Labor Accommodation Cost Share Tool",
      description:
        "Calculate seasonal labor accommodation cost share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          workers: { type: "integer", minimum: 1 },
          nights: { type: "integer", minimum: 0 },
          nightlyCost: { type: "number", minimum: 0 },
          employerFraction: { type: "number", minimum: 0, maximum: 1 },
          fixedCost: { type: "number", minimum: 0 },
        },
        required: [
          "workers",
          "nights",
          "nightlyCost",
          "employerFraction",
          "fixedCost",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossCost: { type: "number" },
          employerCost: { type: "number" },
          workerTotal: { type: "number" },
          perWorker: { type: "number" },
        },
        required: ["grossCost", "employerCost", "workerTotal", "perWorker"],
      },
      ports: {
        inputs: [
          {
            id: "workers",
            label: "Workers",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "nights",
            label: "Nights",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "nightlyCost",
            label: "Nightly Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "employerFraction",
            label: "Employer Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fixedCost",
            label: "Fixed Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "grossCost",
            label: "Gross Cost",
            valueType: { type: "number" },
          },
          {
            id: "employerCost",
            label: "Employer Cost",
            valueType: { type: "number" },
          },
          {
            id: "workerTotal",
            label: "Worker Total",
            valueType: { type: "number" },
          },
          {
            id: "perWorker",
            label: "Per Worker",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = seasonalLaborAccommodationCostShareTool.execute;
export default seasonalLaborAccommodationCostShareTool;
