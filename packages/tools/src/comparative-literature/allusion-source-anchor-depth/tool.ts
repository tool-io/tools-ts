import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourcePath: readonly string[];
  readonly anchorPath: readonly string[];
};
export type Output = {
  readonly commonDepth: number;
  readonly remainingAnchorDepth: number;
  readonly sourceIsPrefix: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourcePath: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    anchorPath: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["sourcePath", "anchorPath"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commonDepth: { type: "integer" },
    remainingAnchorDepth: { type: "integer" },
    sourceIsPrefix: { type: "boolean" },
  },
  required: ["commonDepth", "remainingAnchorDepth", "sourceIsPrefix"],
} as const;
/** Calculate allusion source anchor depth from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourcePath, anchorPath } = request;
  const compute = (): Output => {
    return (() => {
      let commonDepth = 0;
      while (
        commonDepth < Math.min(sourcePath.length, anchorPath.length) &&
        sourcePath[commonDepth] === anchorPath[commonDepth]
      )
        commonDepth++;
      return {
        commonDepth,
        remainingAnchorDepth: anchorPath.length - commonDepth,
        sourceIsPrefix: commonDepth === sourcePath.length,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourcePath: ["book", "chapter"],
    anchorPath: ["book", "chapter", "line"],
  },
  output: { commonDepth: 2, remainingAnchorDepth: 1, sourceIsPrefix: true },
} satisfies ToolExample<Input, Output>;
export const allusionSourceAnchorDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/allusion-source-anchor-depth",
    title: "Allusion Source Anchor Depth Tool",
    description:
      "Calculate allusion source anchor depth from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourcePath: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        anchorPath: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["sourcePath", "anchorPath"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commonDepth: { type: "integer" },
        remainingAnchorDepth: { type: "integer" },
        sourceIsPrefix: { type: "boolean" },
      },
      required: ["commonDepth", "remainingAnchorDepth", "sourceIsPrefix"],
    },
    ports: {
      inputs: [
        {
          id: "sourcePath",
          label: "Source Path",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "anchorPath",
          label: "Anchor Path",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "commonDepth",
          label: "Common Depth",
          valueType: { type: "integer" },
        },
        {
          id: "remainingAnchorDepth",
          label: "Remaining Anchor Depth",
          valueType: { type: "integer" },
        },
        {
          id: "sourceIsPrefix",
          label: "Source Is Prefix",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = allusionSourceAnchorDepthTool.execute;
export default allusionSourceAnchorDepthTool;
