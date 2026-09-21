import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly time: number;
  readonly artifactStart: number;
  readonly artifactEnd: number;
  readonly includeStart: boolean;
  readonly includeEnd: boolean;
};
export type Output = { readonly censored: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    artifactStart: { type: "number" },
    artifactEnd: { type: "number" },
    includeStart: { type: "boolean" },
    includeEnd: { type: "boolean" },
  },
  required: [
    "time",
    "artifactStart",
    "artifactEnd",
    "includeStart",
    "includeEnd",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { censored: { type: "boolean" } },
  required: ["censored"],
} as const;
/** Apply a caller-annotated monitor artifact interval and explicit endpoint policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { time, artifactStart, artifactEnd, includeStart, includeEnd } =
    request;
  const compute = (): Output => {
    H.domain(artifactStart <= artifactEnd);
    return {
      censored:
        (includeStart ? time >= artifactStart : time > artifactStart) &&
        (includeEnd ? time <= artifactEnd : time < artifactEnd),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    time: 5,
    artifactStart: 5,
    artifactEnd: 8,
    includeStart: true,
    includeEnd: false,
  },
  output: { censored: true },
} satisfies ToolExample<Input, Output>;
export const monitorArtifactCensorBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/monitor-artifact-censor-boundary",
    title: "Monitor Artifact Censor Boundary Tool",
    description:
      "Apply a caller-annotated monitor artifact interval and explicit endpoint policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        artifactStart: { type: "number" },
        artifactEnd: { type: "number" },
        includeStart: { type: "boolean" },
        includeEnd: { type: "boolean" },
      },
      required: [
        "time",
        "artifactStart",
        "artifactEnd",
        "includeStart",
        "includeEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { censored: { type: "boolean" } },
      required: ["censored"],
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
          id: "artifactStart",
          label: "Artifact Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "artifactEnd",
          label: "Artifact End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeStart",
          label: "Include Start",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeEnd",
          label: "Include End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "censored", label: "Censored", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = monitorArtifactCensorBoundaryTool.execute;
export default monitorArtifactCensorBoundaryTool;
