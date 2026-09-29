import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly travelerLegDistances: readonly number[];
  readonly sharedLegDistance: number;
  readonly sharedTravelers: number;
};
export type Output = {
  readonly personDistance: number;
  readonly vehicleDistance: number;
  readonly sharedDistanceSaving: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    travelerLegDistances: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    sharedLegDistance: { type: "number", minimum: 0 },
    sharedTravelers: { type: "integer", minimum: 1 },
  },
  required: ["travelerLegDistances", "sharedLegDistance", "sharedTravelers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personDistance: { type: "number" },
    vehicleDistance: { type: "number" },
    sharedDistanceSaving: { type: "number" },
  },
  required: ["personDistance", "vehicleDistance", "sharedDistanceSaving"],
} as const;
/** Remove duplicated distance for one explicitly shared vehicle leg; supplied traveler distances include that leg for every sharer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { travelerLegDistances, sharedLegDistance, sharedTravelers } = request;
  const compute = (): Output => {
    H.domain(
      travelerLegDistances.every((x) => x >= 0) && sharedLegDistance >= 0,
    );
    H.integer(sharedTravelers, 1, travelerLegDistances.length);
    H.domain(
      travelerLegDistances.reduce((a, b) => a + b, 0) >=
        sharedLegDistance * sharedTravelers,
    );
    return {
      personDistance: travelerLegDistances.reduce((a, b) => a + b, 0),
      vehicleDistance:
        travelerLegDistances.reduce((a, b) => a + b, 0) -
        sharedLegDistance * (sharedTravelers - 1),
      sharedDistanceSaving: sharedLegDistance * (sharedTravelers - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    travelerLegDistances: [10, 12, 8],
    sharedLegDistance: 4,
    sharedTravelers: 3,
  },
  output: { personDistance: 30, vehicleDistance: 22, sharedDistanceSaving: 8 },
} satisfies ToolExample<Input, Output>;
export const householdTripChainSharedLegTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/household-trip-chain-shared-leg-term",
    title: "Household Trip Chain Shared Leg Term Tool",
    description:
      "Remove duplicated distance for one explicitly shared vehicle leg; supplied traveler distances include that leg for every sharer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        travelerLegDistances: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        sharedLegDistance: { type: "number", minimum: 0 },
        sharedTravelers: { type: "integer", minimum: 1 },
      },
      required: [
        "travelerLegDistances",
        "sharedLegDistance",
        "sharedTravelers",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personDistance: { type: "number" },
        vehicleDistance: { type: "number" },
        sharedDistanceSaving: { type: "number" },
      },
      required: ["personDistance", "vehicleDistance", "sharedDistanceSaving"],
    },
    ports: {
      inputs: [
        {
          id: "travelerLegDistances",
          label: "Traveler Leg Distances",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sharedLegDistance",
          label: "Shared Leg Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedTravelers",
          label: "Shared Travelers",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "personDistance",
          label: "Person Distance",
          valueType: { type: "number" },
        },
        {
          id: "vehicleDistance",
          label: "Vehicle Distance",
          valueType: { type: "number" },
        },
        {
          id: "sharedDistanceSaving",
          label: "Shared Distance Saving",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = householdTripChainSharedLegTermTool.execute;
export default householdTripChainSharedLegTermTool;
