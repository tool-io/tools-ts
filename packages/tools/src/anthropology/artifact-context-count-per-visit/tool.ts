import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly artifactCount: number;
  readonly visitCount: number;
};
export type Output = { readonly artifactsPerVisit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    artifactCount: { type: "integer", minimum: 0 },
    visitCount: { type: "integer", minimum: 1 },
  },
  required: ["artifactCount", "visitCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { artifactsPerVisit: { type: "number" } },
  required: ["artifactsPerVisit"],
} as const;
/** Normalize an explicit artifact-context count by a positive number of visits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { artifactCount, visitCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(artifactCount) &&
        artifactCount >= 0 &&
        artifactCount <= Number.MAX_SAFE_INTEGER,
      "artifactCount",
    ),
      artifactCount);
    (H.domain(
      Number.isSafeInteger(visitCount) &&
        visitCount >= 1 &&
        visitCount <= Number.MAX_SAFE_INTEGER,
      "visitCount",
    ),
      visitCount);
    return { artifactsPerVisit: artifactCount / visitCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { artifactCount: 18, visitCount: 4 },
  output: { artifactsPerVisit: 4.5 },
} satisfies ToolExample<Input, Output>;
export const artifactContextCountPerVisitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/artifact-context-count-per-visit",
    title: "Artifact Context Count Per Visit Tool",
    description:
      "Normalize an explicit artifact-context count by a positive number of visits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        artifactCount: { type: "integer", minimum: 0 },
        visitCount: { type: "integer", minimum: 1 },
      },
      required: ["artifactCount", "visitCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { artifactsPerVisit: { type: "number" } },
      required: ["artifactsPerVisit"],
    },
    ports: {
      inputs: [
        {
          id: "artifactCount",
          label: "Artifact Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "visitCount",
          label: "Visit Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "artifactsPerVisit",
          label: "Artifacts Per Visit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artifactContextCountPerVisitTool.execute;
export default artifactContextCountPerVisitTool;
