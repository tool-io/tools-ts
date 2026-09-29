import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residentPopulation: number;
  readonly incomingCommuters: number;
  readonly outgoingCommuters: number;
  readonly landArea: number;
};
export type Output = {
  readonly nightDensity: number;
  readonly dayPopulation: number;
  readonly dayDensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residentPopulation: { type: "number", minimum: 0 },
    incomingCommuters: { type: "number", minimum: 0 },
    outgoingCommuters: { type: "number", minimum: 0 },
    landArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "residentPopulation",
    "incomingCommuters",
    "outgoingCommuters",
    "landArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nightDensity: { type: "number" },
    dayPopulation: { type: "number" },
    dayDensity: { type: "number" },
  },
  required: ["nightDensity", "dayPopulation", "dayDensity"],
} as const;
/** Simple commuter-adjusted daytime population density, excluding tourists and other unmodeled flows. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { residentPopulation, incomingCommuters, outgoingCommuters, landArea } =
    request;
  const compute = (): Output => {
    H.domain(
      residentPopulation >= 0 &&
        incomingCommuters >= 0 &&
        outgoingCommuters >= 0 &&
        residentPopulation + incomingCommuters >= outgoingCommuters,
    );
    H.positive(landArea);
    return {
      nightDensity: residentPopulation / landArea,
      dayPopulation: residentPopulation + incomingCommuters - outgoingCommuters,
      dayDensity:
        (residentPopulation + incomingCommuters - outgoingCommuters) / landArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    residentPopulation: 1000,
    incomingCommuters: 500,
    outgoingCommuters: 200,
    landArea: 10,
  },
  output: { nightDensity: 100, dayPopulation: 1300, dayDensity: 130 },
} satisfies ToolExample<Input, Output>;
export const populationDensityDayNightDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "human-geography/population-density-day-night-denominator",
      title: "Population Density Day Night Denominator Tool",
      description:
        "Simple commuter-adjusted daytime population density, excluding tourists and other unmodeled flows.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residentPopulation: { type: "number", minimum: 0 },
          incomingCommuters: { type: "number", minimum: 0 },
          outgoingCommuters: { type: "number", minimum: 0 },
          landArea: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "residentPopulation",
          "incomingCommuters",
          "outgoingCommuters",
          "landArea",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nightDensity: { type: "number" },
          dayPopulation: { type: "number" },
          dayDensity: { type: "number" },
        },
        required: ["nightDensity", "dayPopulation", "dayDensity"],
      },
      ports: {
        inputs: [
          {
            id: "residentPopulation",
            label: "Resident Population",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "incomingCommuters",
            label: "Incoming Commuters",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outgoingCommuters",
            label: "Outgoing Commuters",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "landArea",
            label: "Land Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "nightDensity",
            label: "Night Density",
            valueType: { type: "number" },
          },
          {
            id: "dayPopulation",
            label: "Day Population",
            valueType: { type: "number" },
          },
          {
            id: "dayDensity",
            label: "Day Density",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = populationDensityDayNightDenominatorTool.execute;
export default populationDensityDayNightDenominatorTool;
