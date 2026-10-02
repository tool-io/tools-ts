import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenced: readonly string[];
  readonly publicIndex: readonly string[];
};
export type Output = {
  readonly missing: readonly string[];
  readonly resolved: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenced: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    publicIndex: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["referenced", "publicIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missing: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    resolved: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["missing", "resolved"],
} as const;
/** Find missing exact references in a bounded caller-supplied public annex index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenced, publicIndex } = request;
  const compute = (): Output => {
    const refs = [...new Set(referenced)];
    return {
      missing: refs.filter((x) => !publicIndex.includes(x)),
      resolved: refs.filter((x) => publicIndex.includes(x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenced: ["A1", "A3", "A1"], publicIndex: ["A1", "A2"] },
  output: { missing: ["A3"], resolved: ["A1"] },
} satisfies ToolExample<Input, Output>;
export const publicAccordAnnexReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/public-accord-annex-reference-gap",
    title: "Public Accord Annex Reference Gap Tool",
    description:
      "Find missing exact references in a bounded caller-supplied public annex index.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenced: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        publicIndex: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["referenced", "publicIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missing: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        resolved: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["missing", "resolved"],
    },
    ports: {
      inputs: [
        {
          id: "referenced",
          label: "Referenced",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "publicIndex",
          label: "Public Index",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "missing",
          label: "Missing",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "resolved",
          label: "Resolved",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = publicAccordAnnexReferenceGapTool.execute;
export default publicAccordAnnexReferenceGapTool;
