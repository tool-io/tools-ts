import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalSamples: number;
  readonly artifactSamples: number;
  readonly missingSamples: number;
  readonly overlappingExcluded: number;
  readonly sampleHz: number;
};
export type Output = {
  readonly excludedUnion: number;
  readonly eligibleSamples: number;
  readonly eligibleSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSamples: { type: "integer", minimum: 0 },
    artifactSamples: { type: "integer", minimum: 0 },
    missingSamples: { type: "integer", minimum: 0 },
    overlappingExcluded: { type: "integer", minimum: 0 },
    sampleHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "totalSamples",
    "artifactSamples",
    "missingSamples",
    "overlappingExcluded",
    "sampleHz",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excludedUnion: { type: "integer" },
    eligibleSamples: { type: "integer" },
    eligibleSeconds: { type: "number" },
  },
  required: ["excludedUnion", "eligibleSamples", "eligibleSeconds"],
} as const;
/** Count usable log samples after overlapping artifact and missing exclusions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    totalSamples,
    artifactSamples,
    missingSamples,
    overlappingExcluded,
    sampleHz,
  } = request;
  const compute = (): Output => {
    H.integer(totalSamples, 0);
    H.integer(artifactSamples, 0, totalSamples);
    H.integer(missingSamples, 0, totalSamples);
    H.integer(
      overlappingExcluded,
      0,
      Math.min(artifactSamples, missingSamples),
    );
    H.domain(
      artifactSamples + missingSamples - overlappingExcluded <= totalSamples,
      "overlappingExcluded",
    );
    H.positive(sampleHz);
    return {
      excludedUnion: artifactSamples + missingSamples - overlappingExcluded,
      eligibleSamples:
        totalSamples - artifactSamples - missingSamples + overlappingExcluded,
      eligibleSeconds:
        (totalSamples -
          artifactSamples -
          missingSamples +
          overlappingExcluded) /
        sampleHz,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalSamples: 1000,
    artifactSamples: 100,
    missingSamples: 50,
    overlappingExcluded: 20,
    sampleHz: 100,
  },
  output: { excludedUnion: 130, eligibleSamples: 870, eligibleSeconds: 8.7 },
} satisfies ToolExample<Input, Output>;
export const anesthesiaLogArtifactExclusionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/anesthesia-log-artifact-exclusion-term",
    title: "Anesthesia Log Artifact Exclusion Term Tool",
    description:
      "Count usable log samples after overlapping artifact and missing exclusions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalSamples: { type: "integer", minimum: 0 },
        artifactSamples: { type: "integer", minimum: 0 },
        missingSamples: { type: "integer", minimum: 0 },
        overlappingExcluded: { type: "integer", minimum: 0 },
        sampleHz: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "totalSamples",
        "artifactSamples",
        "missingSamples",
        "overlappingExcluded",
        "sampleHz",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excludedUnion: { type: "integer" },
        eligibleSamples: { type: "integer" },
        eligibleSeconds: { type: "number" },
      },
      required: ["excludedUnion", "eligibleSamples", "eligibleSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "totalSamples",
          label: "Total Samples",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "artifactSamples",
          label: "Artifact Samples",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "missingSamples",
          label: "Missing Samples",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "overlappingExcluded",
          label: "Overlapping Excluded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleHz",
          label: "Sample Hz",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "excludedUnion",
          label: "Excluded Union",
          valueType: { type: "integer" },
        },
        {
          id: "eligibleSamples",
          label: "Eligible Samples",
          valueType: { type: "integer" },
        },
        {
          id: "eligibleSeconds",
          label: "Eligible Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = anesthesiaLogArtifactExclusionTermTool.execute;
export default anesthesiaLogArtifactExclusionTermTool;
