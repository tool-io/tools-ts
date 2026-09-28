import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly legsKm: readonly number[];
  readonly excludedLegs: readonly boolean[];
  readonly detourFactor: number;
};
export type Output = {
  readonly recordedKm: number;
  readonly includedKm: number;
  readonly adjustedIncludedKm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    legsKm: { type: "array", maxItems: 256, items: { type: "number" } },
    excludedLegs: { type: "array", maxItems: 256, items: { type: "boolean" } },
    detourFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["legsKm", "excludedLegs", "detourFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedKm: { type: "number" },
    includedKm: { type: "number" },
    adjustedIncludedKm: { type: "number" },
  },
  required: ["recordedKm", "includedKm", "adjustedIncludedKm"],
} as const;
/** Explicit travel-leg inclusion and supplied detour scaling; no routing, emissions or border crossing is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { legsKm, excludedLegs, detourFactor } = request;
  const compute = (): Output => {
    H.domain(
      legsKm.length === excludedLegs.length && legsKm.every((x) => x >= 0),
    );
    H.positive(detourFactor);
    return {
      recordedKm: legsKm.reduce((a, b) => a + b, 0),
      includedKm: legsKm.reduce((a, b, i) => a + (excludedLegs[i] ? 0 : b), 0),
      adjustedIncludedKm:
        legsKm.reduce((a, b, i) => a + (excludedLegs[i] ? 0 : b), 0) *
        detourFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    legsKm: [100, 200, 50],
    excludedLegs: [false, true, false],
    detourFactor: 1.2,
  },
  output: { recordedKm: 350, includedKm: 150, adjustedIncludedKm: 180 },
} satisfies ToolExample<Input, Output>;
export const globalMobilityTravelDistanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/global-mobility-travel-distance-term",
    title: "Global Mobility Travel Distance Term Tool",
    description:
      "Explicit travel-leg inclusion and supplied detour scaling; no routing, emissions or border crossing is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        legsKm: { type: "array", maxItems: 256, items: { type: "number" } },
        excludedLegs: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        detourFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["legsKm", "excludedLegs", "detourFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedKm: { type: "number" },
        includedKm: { type: "number" },
        adjustedIncludedKm: { type: "number" },
      },
      required: ["recordedKm", "includedKm", "adjustedIncludedKm"],
    },
    ports: {
      inputs: [
        {
          id: "legsKm",
          label: "Legs Km",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "excludedLegs",
          label: "Excluded Legs",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "detourFactor",
          label: "Detour Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recordedKm",
          label: "Recorded Km",
          valueType: { type: "number" },
        },
        {
          id: "includedKm",
          label: "Included Km",
          valueType: { type: "number" },
        },
        {
          id: "adjustedIncludedKm",
          label: "Adjusted Included Km",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = globalMobilityTravelDistanceTermTool.execute;
export default globalMobilityTravelDistanceTermTool;
