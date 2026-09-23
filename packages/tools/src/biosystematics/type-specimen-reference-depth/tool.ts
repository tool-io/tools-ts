import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceParts: readonly string[];
  readonly includeRoot: boolean;
};
export type Output = { readonly depth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceParts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    includeRoot: { type: "boolean" },
  },
  required: ["referenceParts", "includeRoot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depth: { type: "integer" } },
  required: ["depth"],
} as const;
/** Count supplied public specimen-reference components without locating or resolving a specimen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceParts, includeRoot } = request;
  const compute = (): Output => {
    return {
      depth: Math.max(0, referenceParts.length - (includeRoot ? 0 : 1)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceParts: ["repo", "collection", "item"], includeRoot: false },
  output: { depth: 2 },
} satisfies ToolExample<Input, Output>;
export const typeSpecimenReferenceDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/type-specimen-reference-depth",
    title: "Type Specimen Reference Depth Tool",
    description:
      "Count supplied public specimen-reference components without locating or resolving a specimen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceParts: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        includeRoot: { type: "boolean" },
      },
      required: ["referenceParts", "includeRoot"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depth: { type: "integer" } },
      required: ["depth"],
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
          id: "includeRoot",
          label: "Include Root",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "depth", label: "Depth", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = typeSpecimenReferenceDepthTool.execute;
export default typeSpecimenReferenceDepthTool;
