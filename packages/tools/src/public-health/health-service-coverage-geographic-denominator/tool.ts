import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly servedResidents: number;
  readonly localPopulation: number;
  readonly nonresidentClients: number;
  readonly allClients: number;
};
export type Output = {
  readonly residentCoverage: number;
  readonly nonresidentShare: number;
  readonly residentClientGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    servedResidents: { type: "integer", minimum: 0 },
    localPopulation: { type: "integer", minimum: 1 },
    nonresidentClients: { type: "integer", minimum: 0 },
    allClients: { type: "integer", minimum: 1 },
  },
  required: [
    "servedResidents",
    "localPopulation",
    "nonresidentClients",
    "allClients",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residentCoverage: { type: "number" },
    nonresidentShare: { type: "number" },
    residentClientGap: { type: "integer" },
  },
  required: ["residentCoverage", "nonresidentShare", "residentClientGap"],
} as const;
/** Separate unique resident coverage from all client contacts and nonresident visits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { servedResidents, localPopulation, nonresidentClients, allClients } =
    request;
  const compute = (): Output => {
    H.integer(localPopulation, 1);
    H.integer(servedResidents, 0, localPopulation);
    H.integer(allClients, 1);
    H.integer(nonresidentClients, 0, allClients);
    H.domain(allClients - nonresidentClients >= servedResidents);
    return {
      residentCoverage: servedResidents / localPopulation,
      nonresidentShare: nonresidentClients / allClients,
      residentClientGap: allClients - nonresidentClients - servedResidents,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    servedResidents: 80,
    localPopulation: 200,
    nonresidentClients: 20,
    allClients: 110,
  },
  output: {
    residentCoverage: 0.4,
    nonresidentShare: 0.18181818181818182,
    residentClientGap: 10,
  },
} satisfies ToolExample<Input, Output>;
export const healthServiceCoverageGeographicDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-health/health-service-coverage-geographic-denominator",
      title: "Health Service Coverage Geographic Denominator Tool",
      description:
        "Separate unique resident coverage from all client contacts and nonresident visits.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          servedResidents: { type: "integer", minimum: 0 },
          localPopulation: { type: "integer", minimum: 1 },
          nonresidentClients: { type: "integer", minimum: 0 },
          allClients: { type: "integer", minimum: 1 },
        },
        required: [
          "servedResidents",
          "localPopulation",
          "nonresidentClients",
          "allClients",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residentCoverage: { type: "number" },
          nonresidentShare: { type: "number" },
          residentClientGap: { type: "integer" },
        },
        required: ["residentCoverage", "nonresidentShare", "residentClientGap"],
      },
      ports: {
        inputs: [
          {
            id: "servedResidents",
            label: "Served Residents",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "localPopulation",
            label: "Local Population",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "nonresidentClients",
            label: "Nonresident Clients",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "allClients",
            label: "All Clients",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "residentCoverage",
            label: "Resident Coverage",
            valueType: { type: "number" },
          },
          {
            id: "nonresidentShare",
            label: "Nonresident Share",
            valueType: { type: "number" },
          },
          {
            id: "residentClientGap",
            label: "Resident Client Gap",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthServiceCoverageGeographicDenominatorTool.execute;
export default healthServiceCoverageGeographicDenominatorTool;
