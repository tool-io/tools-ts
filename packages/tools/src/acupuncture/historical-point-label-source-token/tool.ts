import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly label: string;
  readonly source: string;
  readonly sourceLabels: readonly string[];
  readonly sourceKnown: boolean;
};
export type Output = {
  readonly recognized: boolean;
  readonly sourceKey: string;
  readonly unresolvedSource: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    sourceLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceKnown: { type: "boolean" },
  },
  required: ["label", "source", "sourceLabels", "sourceKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognized: { type: "boolean" },
    sourceKey: { type: "string", maxLength: 8192 },
    unresolvedSource: { type: "boolean" },
  },
  required: ["recognized", "sourceKey", "unresolvedSource"],
} as const;
/** Inspect caller-supplied historical label provenance without locating points or providing treatment instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label, source, sourceLabels, sourceKnown } = request;
  const compute = (): Output => {
    return {
      recognized: sourceKnown && sourceLabels.includes(label),
      sourceKey: JSON.stringify([source, label]),
      unresolvedSource: !sourceKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    label: "P1",
    source: "catalog-A",
    sourceLabels: ["P1", "P2"],
    sourceKnown: true,
  },
  output: {
    recognized: true,
    sourceKey: '["catalog-A","P1"]',
    unresolvedSource: false,
  },
} satisfies ToolExample<Input, Output>;
export const historicalPointLabelSourceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "acupuncture/historical-point-label-source-token",
    title: "Historical Point Label Source Token Tool",
    description:
      "Inspect caller-supplied historical label provenance without locating points or providing treatment instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        sourceLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceKnown: { type: "boolean" },
      },
      required: ["label", "source", "sourceLabels", "sourceKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        sourceKey: { type: "string", maxLength: 8192 },
        unresolvedSource: { type: "boolean" },
      },
      required: ["recognized", "sourceKey", "unresolvedSource"],
    },
    ports: {
      inputs: [
        {
          id: "label",
          label: "Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceLabels",
          label: "Source Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceKnown",
          label: "Source Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
        {
          id: "unresolvedSource",
          label: "Unresolved Source",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalPointLabelSourceTokenTool.execute;
export default historicalPointLabelSourceTokenTool;
