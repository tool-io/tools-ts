import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hits: number;
  readonly eligiblePoints: number;
  readonly excludedPoints: number;
  readonly referenceArea: number;
};
export type Output = {
  readonly fraction: number;
  readonly estimatedArea: number;
  readonly excludedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hits: { type: "integer", minimum: 0 },
    eligiblePoints: { type: "integer", minimum: 1 },
    excludedPoints: { type: "integer", minimum: 0 },
    referenceArea: { type: "number", minimum: 0 },
  },
  required: ["hits", "eligiblePoints", "excludedPoints", "referenceArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    estimatedArea: { type: "number" },
    excludedFraction: { type: "number" },
  },
  required: ["fraction", "estimatedArea", "excludedFraction"],
} as const;
/** Systematic/random point area-fraction estimate from explicitly eligible points; sampling design validity is external. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hits, eligiblePoints, excludedPoints, referenceArea } = request;
  const compute = (): Output => {
    H.integer(eligiblePoints, 1);
    H.integer(hits, 0, eligiblePoints);
    H.integer(excludedPoints, 0);
    H.domain(referenceArea >= 0);
    return {
      fraction: hits / eligiblePoints,
      estimatedArea: (referenceArea * hits) / eligiblePoints,
      excludedFraction: excludedPoints / (eligiblePoints + excludedPoints),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    hits: 30,
    eligiblePoints: 100,
    excludedPoints: 20,
    referenceArea: 50,
  },
  output: {
    fraction: 0.3,
    estimatedArea: 15,
    excludedFraction: 0.16666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const stereologyPointCountAreaFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/stereology-point-count-area-fraction",
    title: "Stereology Point Count Area Fraction Tool",
    description:
      "Systematic/random point area-fraction estimate from explicitly eligible points; sampling design validity is external.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hits: { type: "integer", minimum: 0 },
        eligiblePoints: { type: "integer", minimum: 1 },
        excludedPoints: { type: "integer", minimum: 0 },
        referenceArea: { type: "number", minimum: 0 },
      },
      required: ["hits", "eligiblePoints", "excludedPoints", "referenceArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        estimatedArea: { type: "number" },
        excludedFraction: { type: "number" },
      },
      required: ["fraction", "estimatedArea", "excludedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "hits",
          label: "Hits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eligiblePoints",
          label: "Eligible Points",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedPoints",
          label: "Excluded Points",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceArea",
          label: "Reference Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "estimatedArea",
          label: "Estimated Area",
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
export const run = stereologyPointCountAreaFractionTool.execute;
export default stereologyPointCountAreaFractionTool;
