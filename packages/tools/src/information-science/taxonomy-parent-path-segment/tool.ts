import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly segments: readonly string[] };
export type Output = {
  readonly hasParent: boolean;
  readonly parentSegments: readonly string[];
  readonly terminalSegment: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segments: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["segments"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hasParent: { type: "boolean" },
    parentSegments: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    terminalSegment: { type: "string", maxLength: 8192 },
  },
  required: ["hasParent", "parentSegments", "terminalSegment"],
} as const;
/** Split an explicit nonempty taxonomy path into parent path and terminal segment without resolving a taxonomy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segments } = request;
  const compute = (): Output => {
    H.domain(
      segments.length > 0 && segments.every((s) => s.length > 0),
      "segments",
    );
    return {
      hasParent: segments.length > 1,
      parentSegments: segments.slice(0, -1),
      terminalSegment: segments[segments.length - 1],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { segments: ["Life", "Plants", "Trees"] },
  output: {
    hasParent: true,
    parentSegments: ["Life", "Plants"],
    terminalSegment: "Trees",
  },
} satisfies ToolExample<Input, Output>;
export const taxonomyParentPathSegmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "information-science",
        "information science",
        "information and language sciences",
      ],
      keywords: ["information science", "information and language sciences"],
    },
    id: "information-science/taxonomy-parent-path-segment",
    title: "Taxonomy Parent Path Segment",
    description:
      "Split an explicit nonempty taxonomy path into parent path and terminal segment without resolving a taxonomy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segments: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["segments"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hasParent: { type: "boolean" },
        parentSegments: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        terminalSegment: { type: "string", maxLength: 8192 },
      },
      required: ["hasParent", "parentSegments", "terminalSegment"],
    },
    ports: {
      inputs: [
        {
          id: "segments",
          label: "Segments",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "hasParent",
          label: "Has Parent",
          valueType: { type: "boolean" },
        },
        {
          id: "parentSegments",
          label: "Parent Segments",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "terminalSegment",
          label: "Terminal Segment",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonomyParentPathSegmentTool.execute;
export default taxonomyParentPathSegmentTool;
