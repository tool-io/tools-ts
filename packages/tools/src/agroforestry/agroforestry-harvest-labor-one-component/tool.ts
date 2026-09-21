import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly units: number;
  readonly minutesPerUnit: number;
  readonly workers: number;
  readonly hourlyCost: number;
};
export type Output = {
  readonly personHours: number;
  readonly elapsedHours: number;
  readonly laborCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    units: { type: "number", minimum: 0 },
    minutesPerUnit: { type: "number", minimum: 0 },
    workers: { type: "integer", minimum: 1 },
    hourlyCost: { type: "number", minimum: 0 },
  },
  required: ["units", "minutesPerUnit", "workers", "hourlyCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personHours: { type: "number" },
    elapsedHours: { type: "number" },
    laborCost: { type: "number" },
  },
  required: ["personHours", "elapsedHours", "laborCost"],
} as const;
/** Calculate agroforestry harvest labor one component from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { units, minutesPerUnit, workers, hourlyCost } = request;
  const compute = (): Output => {
    H.integer(workers, 1);
    H.domain(units >= 0 && minutesPerUnit >= 0 && hourlyCost >= 0);
    return {
      personHours: (units * minutesPerUnit) / 60,
      elapsedHours: (units * minutesPerUnit) / (60 * workers),
      laborCost: (units * minutesPerUnit * hourlyCost) / 60,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { units: 100, minutesPerUnit: 3, workers: 2, hourlyCost: 20 },
  output: { personHours: 5, elapsedHours: 2.5, laborCost: 100 },
} satisfies ToolExample<Input, Output>;
export const agroforestryHarvestLaborOneComponentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroforestry/agroforestry-harvest-labor-one-component",
      title: "Agroforestry Harvest Labor One Component Tool",
      description:
        "Calculate agroforestry harvest labor one component from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          units: { type: "number", minimum: 0 },
          minutesPerUnit: { type: "number", minimum: 0 },
          workers: { type: "integer", minimum: 1 },
          hourlyCost: { type: "number", minimum: 0 },
        },
        required: ["units", "minutesPerUnit", "workers", "hourlyCost"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          personHours: { type: "number" },
          elapsedHours: { type: "number" },
          laborCost: { type: "number" },
        },
        required: ["personHours", "elapsedHours", "laborCost"],
      },
      ports: {
        inputs: [
          {
            id: "units",
            label: "Units",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minutesPerUnit",
            label: "Minutes Per Unit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "workers",
            label: "Workers",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "hourlyCost",
            label: "Hourly Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "personHours",
            label: "Person Hours",
            valueType: { type: "number" },
          },
          {
            id: "elapsedHours",
            label: "Elapsed Hours",
            valueType: { type: "number" },
          },
          {
            id: "laborCost",
            label: "Labor Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agroforestryHarvestLaborOneComponentTool.execute;
export default agroforestryHarvestLaborOneComponentTool;
