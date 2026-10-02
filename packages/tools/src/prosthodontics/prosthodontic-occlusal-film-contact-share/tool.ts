import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markedArea: number;
  readonly totalArea: number;
  readonly artifactArea: number;
  readonly markedArtifactOverlap: number;
};
export type Output = {
  readonly eligibleArea: number;
  readonly eligibleMarked: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markedArea: { type: "number", minimum: 0 },
    totalArea: { type: "number" },
    artifactArea: { type: "number", minimum: 0 },
    markedArtifactOverlap: { type: "number", minimum: 0 },
  },
  required: [
    "markedArea",
    "totalArea",
    "artifactArea",
    "markedArtifactOverlap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleArea: { type: "number" },
    eligibleMarked: { type: "number" },
    share: { type: "number" },
  },
  required: ["eligibleArea", "eligibleMarked", "share"],
} as const;
/** Calculate prosthodontic occlusal film contact share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markedArea, totalArea, artifactArea, markedArtifactOverlap } =
    request;
  const compute = (): Output => {
    H.domain(
      totalArea > artifactArea &&
        artifactArea >= 0 &&
        markedArea >= 0 &&
        markedArea <= totalArea &&
        markedArtifactOverlap >= 0 &&
        markedArtifactOverlap <= Math.min(markedArea, artifactArea) &&
        markedArea - markedArtifactOverlap <= totalArea - artifactArea,
    );
    return {
      eligibleArea: totalArea - artifactArea,
      eligibleMarked: markedArea - markedArtifactOverlap,
      share: (markedArea - markedArtifactOverlap) / (totalArea - artifactArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    markedArea: 30,
    totalArea: 100,
    artifactArea: 10,
    markedArtifactOverlap: 5,
  },
  output: { eligibleArea: 90, eligibleMarked: 25, share: 0.2777777777777778 },
} satisfies ToolExample<Input, Output>;
export const prosthodonticOcclusalFilmContactShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "prosthodontics/prosthodontic-occlusal-film-contact-share",
      title: "Prosthodontic Occlusal Film Contact Share Tool",
      description:
        "Calculate prosthodontic occlusal film contact share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          markedArea: { type: "number", minimum: 0 },
          totalArea: { type: "number" },
          artifactArea: { type: "number", minimum: 0 },
          markedArtifactOverlap: { type: "number", minimum: 0 },
        },
        required: [
          "markedArea",
          "totalArea",
          "artifactArea",
          "markedArtifactOverlap",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleArea: { type: "number" },
          eligibleMarked: { type: "number" },
          share: { type: "number" },
        },
        required: ["eligibleArea", "eligibleMarked", "share"],
      },
      ports: {
        inputs: [
          {
            id: "markedArea",
            label: "Marked Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalArea",
            label: "Total Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "artifactArea",
            label: "Artifact Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "markedArtifactOverlap",
            label: "Marked Artifact Overlap",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "eligibleArea",
            label: "Eligible Area",
            valueType: { type: "number" },
          },
          {
            id: "eligibleMarked",
            label: "Eligible Marked",
            valueType: { type: "number" },
          },
          { id: "share", label: "Share", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = prosthodonticOcclusalFilmContactShareTool.execute;
export default prosthodonticOcclusalFilmContactShareTool;
