import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labels: readonly string[];
  readonly separator: string;
};
export type Output = {
  readonly containsSeparatorIndices: readonly number[];
  readonly ambiguous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    separator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["labels", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containsSeparatorIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    ambiguous: { type: "boolean" },
  },
  required: ["containsSeparatorIndices", "ambiguous"],
} as const;
/** Flag supplied evaluation labels containing the exact nonempty separator before delimiter-based serialization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labels, separator } = request;
  const compute = (): Output => {
    H.domain(separator.length > 0, "separator");
    return (() => {
      const containsSeparatorIndices = labels.flatMap((label, index) =>
        label.includes(separator) ? [index] : [],
      );
      return {
        containsSeparatorIndices,
        ambiguous: containsSeparatorIndices.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labels: ["cat", "red|blue"], separator: "|" },
  output: { containsSeparatorIndices: [1], ambiguous: true },
} satisfies ToolExample<Input, Output>;
export const evaluationLabelSeparatorAmbiguityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: [
        "artificial-intelligence",
        "artificial intelligence",
        "computer science",
      ],
      keywords: ["artificial intelligence", "computer science"],
    },
    id: "artificial-intelligence/evaluation-label-separator-ambiguity",
    title: "Evaluation Label Separator Ambiguity",
    description:
      "Flag supplied evaluation labels containing the exact nonempty separator before delimiter-based serialization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        separator: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["labels", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        containsSeparatorIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        ambiguous: { type: "boolean" },
      },
      required: ["containsSeparatorIndices", "ambiguous"],
    },
    ports: {
      inputs: [
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "containsSeparatorIndices",
          label: "Contains Separator Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = evaluationLabelSeparatorAmbiguityTool.execute;
export default evaluationLabelSeparatorAmbiguityTool;
