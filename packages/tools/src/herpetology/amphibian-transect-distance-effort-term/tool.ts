import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly searchedWidth: number;
  readonly duration: number;
  readonly observations: number;
};
export type Output = {
  readonly searchedArea: number;
  readonly encounterPerDistance: number;
  readonly observationsPerTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", exclusiveMinimum: 0 },
    searchedWidth: { type: "number", minimum: 0 },
    duration: { type: "number", exclusiveMinimum: 0 },
    observations: { type: "integer", minimum: 0 },
  },
  required: ["distance", "searchedWidth", "duration", "observations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    searchedArea: { type: "number" },
    encounterPerDistance: { type: "number" },
    observationsPerTime: { type: "number" },
  },
  required: ["searchedArea", "encounterPerDistance", "observationsPerTime"],
} as const;
/** Observed transect encounter rates and nominal searched strip area, without detection correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, searchedWidth, duration, observations } = request;
  const compute = (): Output => {
    H.positive(distance);
    H.domain(searchedWidth >= 0);
    H.positive(duration);
    H.integer(observations, 0);
    return {
      searchedArea: distance * searchedWidth,
      encounterPerDistance: observations / distance,
      observationsPerTime: observations / duration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 100, searchedWidth: 2, duration: 30, observations: 15 },
  output: {
    searchedArea: 200,
    encounterPerDistance: 0.15,
    observationsPerTime: 0.5,
  },
} satisfies ToolExample<Input, Output>;
export const amphibianTransectDistanceEffortTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "herpetology/amphibian-transect-distance-effort-term",
      title: "Amphibian Transect Distance Effort Term Tool",
      description:
        "Observed transect encounter rates and nominal searched strip area, without detection correction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number", exclusiveMinimum: 0 },
          searchedWidth: { type: "number", minimum: 0 },
          duration: { type: "number", exclusiveMinimum: 0 },
          observations: { type: "integer", minimum: 0 },
        },
        required: ["distance", "searchedWidth", "duration", "observations"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          searchedArea: { type: "number" },
          encounterPerDistance: { type: "number" },
          observationsPerTime: { type: "number" },
        },
        required: [
          "searchedArea",
          "encounterPerDistance",
          "observationsPerTime",
        ],
      },
      ports: {
        inputs: [
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "searchedWidth",
            label: "Searched Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "duration",
            label: "Duration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observations",
            label: "Observations",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "searchedArea",
            label: "Searched Area",
            valueType: { type: "number" },
          },
          {
            id: "encounterPerDistance",
            label: "Encounter Per Distance",
            valueType: { type: "number" },
          },
          {
            id: "observationsPerTime",
            label: "Observations Per Time",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = amphibianTransectDistanceEffortTermTool.execute;
export default amphibianTransectDistanceEffortTermTool;
