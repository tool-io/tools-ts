import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceParts: readonly string[];
  readonly expectedDepth: number;
  readonly requiredPrefix: readonly string[];
};
export type Output = {
  readonly actualDepth: number;
  readonly depthGap: number;
  readonly prefixMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceParts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    expectedDepth: { type: "integer", minimum: 0 },
    requiredPrefix: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["referenceParts", "expectedDepth", "requiredPrefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualDepth: { type: "integer" },
    depthGap: { type: "integer" },
    prefixMatches: { type: "boolean" },
  },
  required: ["actualDepth", "depthGap", "prefixMatches"],
} as const;
/** Inspect supplied submission hierarchy metadata without interpreting regulatory requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceParts, expectedDepth, requiredPrefix } = request;
  const compute = (): Output => {
    H.integer(expectedDepth, 0);
    return {
      actualDepth: referenceParts.length,
      depthGap: referenceParts.length - expectedDepth,
      prefixMatches:
        requiredPrefix.length <= referenceParts.length &&
        requiredPrefix.every((x, i) => referenceParts[i] === x),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceParts: ["module", "section", "leaf"],
    expectedDepth: 2,
    requiredPrefix: ["module"],
  },
  output: { actualDepth: 3, depthGap: 1, prefixMatches: true },
} satisfies ToolExample<Input, Output>;
export const submissionReferenceDepthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/submission-reference-depth-gap",
    title: "Submission Reference Depth Gap Tool",
    description:
      "Inspect supplied submission hierarchy metadata without interpreting regulatory requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceParts: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        expectedDepth: { type: "integer", minimum: 0 },
        requiredPrefix: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["referenceParts", "expectedDepth", "requiredPrefix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualDepth: { type: "integer" },
        depthGap: { type: "integer" },
        prefixMatches: { type: "boolean" },
      },
      required: ["actualDepth", "depthGap", "prefixMatches"],
    },
    ports: {
      inputs: [
        {
          id: "referenceParts",
          label: "Reference Parts",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "expectedDepth",
          label: "Expected Depth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredPrefix",
          label: "Required Prefix",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "actualDepth",
          label: "Actual Depth",
          valueType: { type: "integer" },
        },
        { id: "depthGap", label: "Depth Gap", valueType: { type: "integer" } },
        {
          id: "prefixMatches",
          label: "Prefix Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = submissionReferenceDepthGapTool.execute;
export default submissionReferenceDepthGapTool;
