import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly artifactId: string;
  readonly artifactIds: readonly string[];
  readonly useTokens: readonly string[];
};
export type Output = {
  readonly annotations: number;
  readonly distinctUses: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    artifactId: { type: "string", maxLength: 8192 },
    artifactIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    useTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["artifactId", "artifactIds", "useTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annotations: { type: "integer" },
    distinctUses: { type: "integer" },
  },
  required: ["annotations", "distinctUses"],
} as const;
/** Calculate artifact use annotation count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { artifactId, artifactIds, useTokens } = request;
  const compute = (): Output => {
    H.sameLength(artifactIds, useTokens);
    return {
      annotations: artifactIds.filter((x) => x === artifactId).length,
      distinctUses: new Set(
        useTokens.filter((x, i) => artifactIds[i] === artifactId),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    artifactId: "A",
    artifactIds: ["A", "B", "A"],
    useTokens: ["use1", "use2", "use1"],
  },
  output: { annotations: 2, distinctUses: 1 },
} satisfies ToolExample<Input, Output>;
export const artifactUseAnnotationCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/artifact-use-annotation-count",
    title: "Artifact Use Annotation Count Tool",
    description:
      "Calculate artifact use annotation count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        artifactId: { type: "string", maxLength: 8192 },
        artifactIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        useTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["artifactId", "artifactIds", "useTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annotations: { type: "integer" },
        distinctUses: { type: "integer" },
      },
      required: ["annotations", "distinctUses"],
    },
    ports: {
      inputs: [
        {
          id: "artifactId",
          label: "Artifact Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "artifactIds",
          label: "Artifact Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "useTokens",
          label: "Use Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "annotations",
          label: "Annotations",
          valueType: { type: "integer" },
        },
        {
          id: "distinctUses",
          label: "Distinct Uses",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = artifactUseAnnotationCountTool.execute;
export default artifactUseAnnotationCountTool;
