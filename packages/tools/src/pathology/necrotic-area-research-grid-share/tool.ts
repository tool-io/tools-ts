import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly designatedHits: number;
  readonly viableHits: number;
  readonly excludedHits: number;
  readonly pointsPerArea: number;
};
export type Output = {
  readonly eligiblePoints: number;
  readonly designatedFraction: number;
  readonly sampledArea: number;
  readonly excludedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    designatedHits: { type: "integer", minimum: 0 },
    viableHits: { type: "integer", minimum: 0 },
    excludedHits: { type: "integer", minimum: 0 },
    pointsPerArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["designatedHits", "viableHits", "excludedHits", "pointsPerArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligiblePoints: { type: "integer" },
    designatedFraction: { type: "number" },
    sampledArea: { type: "number" },
    excludedFraction: { type: "number" },
  },
  required: [
    "eligiblePoints",
    "designatedFraction",
    "sampledArea",
    "excludedFraction",
  ],
} as const;
/** Explicit research grid point fractions and eligible sampled area. Excluded hits are excluded from the designated/viable denominator and reported as a fraction of all hits; this does not classify tissue. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { designatedHits, viableHits, excludedHits, pointsPerArea } = request;
  const compute = (): Output => {
    H.integer(designatedHits, 0);
    H.integer(viableHits, 0);
    H.integer(excludedHits, 0);
    H.domain(designatedHits + viableHits > 0);
    H.positive(pointsPerArea);
    return {
      excludedFraction:
        excludedHits / (designatedHits + viableHits + excludedHits),
      eligiblePoints: designatedHits + viableHits,
      designatedFraction: designatedHits / (designatedHits + viableHits),
      sampledArea: (designatedHits + viableHits) / pointsPerArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    designatedHits: 20,
    viableHits: 80,
    excludedHits: 10,
    pointsPerArea: 50,
  },
  output: {
    eligiblePoints: 100,
    designatedFraction: 0.2,
    sampledArea: 2,
    excludedFraction: 0.09090909090909091,
  },
} satisfies ToolExample<Input, Output>;
export const necroticAreaResearchGridShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/necrotic-area-research-grid-share",
    title: "Necrotic Area Research Grid Share Tool",
    description:
      "Explicit research grid point fractions and eligible sampled area. Excluded hits are excluded from the designated/viable denominator and reported as a fraction of all hits; this does not classify tissue.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        designatedHits: { type: "integer", minimum: 0 },
        viableHits: { type: "integer", minimum: 0 },
        excludedHits: { type: "integer", minimum: 0 },
        pointsPerArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "designatedHits",
        "viableHits",
        "excludedHits",
        "pointsPerArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligiblePoints: { type: "integer" },
        designatedFraction: { type: "number" },
        sampledArea: { type: "number" },
        excludedFraction: { type: "number" },
      },
      required: [
        "eligiblePoints",
        "designatedFraction",
        "sampledArea",
        "excludedFraction",
      ],
    },
    ports: {
      inputs: [
        {
          id: "designatedHits",
          label: "Designated Hits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "viableHits",
          label: "Viable Hits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedHits",
          label: "Excluded Hits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pointsPerArea",
          label: "Points Per Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligiblePoints",
          label: "Eligible Points",
          valueType: { type: "integer" },
        },
        {
          id: "designatedFraction",
          label: "Designated Fraction",
          valueType: { type: "number" },
        },
        {
          id: "sampledArea",
          label: "Sampled Area",
          valueType: { type: "number" },
        },
        {
          id: "excludedFraction",
          label: "Excluded Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = necroticAreaResearchGridShareTool.execute;
export default necroticAreaResearchGridShareTool;
