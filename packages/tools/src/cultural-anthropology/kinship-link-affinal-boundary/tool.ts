import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly links: readonly string[];
  readonly affinalTokens: readonly string[];
};
export type Output = {
  readonly affinalIndices: readonly number[];
  readonly crossesAffinal: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    links: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    affinalTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["links", "affinalTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    affinalIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    crossesAffinal: { type: "boolean" },
  },
  required: ["affinalIndices", "crossesAffinal"],
} as const;
/** Locate explicitly annotated affinal links without inferring culturally specific kinship rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { links, affinalTokens } = request;
  const compute = (): Output => {
    const affinalIndices = links.flatMap((x, i) =>
      affinalTokens.includes(x) ? [i] : [],
    );
    return { affinalIndices, crossesAffinal: affinalIndices.length > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { links: ["parent", "spouse", "sibling"], affinalTokens: ["spouse"] },
  output: { affinalIndices: [1], crossesAffinal: true },
} satisfies ToolExample<Input, Output>;
export const kinshipLinkAffinalBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/kinship-link-affinal-boundary",
    title: "Kinship Link Affinal Boundary Tool",
    description:
      "Locate explicitly annotated affinal links without inferring culturally specific kinship rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        links: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        affinalTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["links", "affinalTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        affinalIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        crossesAffinal: { type: "boolean" },
      },
      required: ["affinalIndices", "crossesAffinal"],
    },
    ports: {
      inputs: [
        {
          id: "links",
          label: "Links",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "affinalTokens",
          label: "Affinal Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "affinalIndices",
          label: "Affinal Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "crossesAffinal",
          label: "Crosses Affinal",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = kinshipLinkAffinalBoundaryTool.execute;
export default kinshipLinkAffinalBoundaryTool;
