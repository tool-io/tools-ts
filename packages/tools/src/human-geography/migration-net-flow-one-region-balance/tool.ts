import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingPopulation: number;
  readonly births: number;
  readonly deaths: number;
  readonly arrivals: number;
  readonly departures: number;
  readonly reclassification: number;
};
export type Output = {
  readonly naturalChange: number;
  readonly netMigration: number;
  readonly closingPopulation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingPopulation: { type: "number", minimum: 0 },
    births: { type: "number", minimum: 0 },
    deaths: { type: "number", minimum: 0 },
    arrivals: { type: "number", minimum: 0 },
    departures: { type: "number", minimum: 0 },
    reclassification: { type: "number" },
  },
  required: [
    "openingPopulation",
    "births",
    "deaths",
    "arrivals",
    "departures",
    "reclassification",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    naturalChange: { type: "number" },
    netMigration: { type: "number" },
    closingPopulation: { type: "number" },
  },
  required: ["naturalChange", "netMigration", "closingPopulation"],
} as const;
/** Calculate migration net flow one region balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    openingPopulation,
    births,
    deaths,
    arrivals,
    departures,
    reclassification,
  } = request;
  const compute = (): Output => {
    H.domain(
      openingPopulation >= 0 &&
        births >= 0 &&
        deaths >= 0 &&
        arrivals >= 0 &&
        departures >= 0,
    );
    return {
      naturalChange: births - deaths,
      netMigration: arrivals - departures,
      closingPopulation:
        openingPopulation +
        births -
        deaths +
        arrivals -
        departures +
        reclassification,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingPopulation: 1000,
    births: 30,
    deaths: 10,
    arrivals: 50,
    departures: 20,
    reclassification: 5,
  },
  output: { naturalChange: 20, netMigration: 30, closingPopulation: 1055 },
} satisfies ToolExample<Input, Output>;
export const migrationNetFlowOneRegionBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/migration-net-flow-one-region-balance",
    title: "Migration Net Flow One Region Balance Tool",
    description:
      "Calculate migration net flow one region balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingPopulation: { type: "number", minimum: 0 },
        births: { type: "number", minimum: 0 },
        deaths: { type: "number", minimum: 0 },
        arrivals: { type: "number", minimum: 0 },
        departures: { type: "number", minimum: 0 },
        reclassification: { type: "number" },
      },
      required: [
        "openingPopulation",
        "births",
        "deaths",
        "arrivals",
        "departures",
        "reclassification",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        naturalChange: { type: "number" },
        netMigration: { type: "number" },
        closingPopulation: { type: "number" },
      },
      required: ["naturalChange", "netMigration", "closingPopulation"],
    },
    ports: {
      inputs: [
        {
          id: "openingPopulation",
          label: "Opening Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "births",
          label: "Births",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deaths",
          label: "Deaths",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "arrivals",
          label: "Arrivals",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "departures",
          label: "Departures",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reclassification",
          label: "Reclassification",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "naturalChange",
          label: "Natural Change",
          valueType: { type: "number" },
        },
        {
          id: "netMigration",
          label: "Net Migration",
          valueType: { type: "number" },
        },
        {
          id: "closingPopulation",
          label: "Closing Population",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = migrationNetFlowOneRegionBalanceTool.execute;
export default migrationNetFlowOneRegionBalanceTool;
