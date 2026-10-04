import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly time: number;
  readonly artifactStarts: readonly number[];
  readonly artifactEnds: readonly number[];
  readonly includeEnds: boolean;
};
export type Output = {
  readonly artifact: boolean;
  readonly matchingIntervals: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    artifactStarts: { type: "array", maxItems: 256, items: { type: "number" } },
    artifactEnds: { type: "array", maxItems: 256, items: { type: "number" } },
    includeEnds: { type: "boolean" },
  },
  required: ["time", "artifactStarts", "artifactEnds", "includeEnds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    artifact: { type: "boolean" },
    matchingIntervals: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["artifact", "matchingIntervals"],
} as const;
/** Check membership in caller-annotated artifact windows without detecting or removing physiological events. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { time, artifactStarts, artifactEnds, includeEnds } = request;
  const compute = (): Output => {
    H.sameLength(artifactStarts, artifactEnds);
    H.domain(artifactStarts.every((x, i) => x <= artifactEnds[i]));
    const matchingIntervals = artifactStarts.flatMap((x, i) =>
      time >= x &&
      (includeEnds ? time <= artifactEnds[i] : time < artifactEnds[i])
        ? [i]
        : [],
    );
    return { artifact: matchingIntervals.length > 0, matchingIntervals };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    time: 5,
    artifactStarts: [0, 4],
    artifactEnds: [2, 5],
    includeEnds: true,
  },
  output: { artifact: true, matchingIntervals: [1] },
} satisfies ToolExample<Input, Output>;
export const uroflowArtifactIntervalTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/uroflow-artifact-interval-token",
    title: "Uroflow Artifact Interval Token Tool",
    description:
      "Check membership in caller-annotated artifact windows without detecting or removing physiological events.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        artifactStarts: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        artifactEnds: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        includeEnds: { type: "boolean" },
      },
      required: ["time", "artifactStarts", "artifactEnds", "includeEnds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        artifact: { type: "boolean" },
        matchingIntervals: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["artifact", "matchingIntervals"],
    },
    ports: {
      inputs: [
        {
          id: "time",
          label: "Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "artifactStarts",
          label: "Artifact Starts",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "artifactEnds",
          label: "Artifact Ends",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "includeEnds",
          label: "Include Ends",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "artifact", label: "Artifact", valueType: { type: "boolean" } },
        {
          id: "matchingIntervals",
          label: "Matching Intervals",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = uroflowArtifactIntervalTokenTool.execute;
export default uroflowArtifactIntervalTokenTool;
