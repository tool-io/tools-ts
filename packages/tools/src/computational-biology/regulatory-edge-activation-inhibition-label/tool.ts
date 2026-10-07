import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly targetId: string;
  readonly relation: string;
};
export type Output = { readonly label: string; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    targetId: { type: "string", maxLength: 8192, minLength: 1 },
    relation: {
      type: "string",
      maxLength: 8192,
      enum: ["activation", "inhibition", "unknown"],
    },
  },
  required: ["sourceId", "targetId", "relation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    sign: { type: "integer" },
  },
  required: ["label", "sign"],
} as const;
/** Label an explicitly recorded regulatory edge and its sign without inferring biological interactions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, targetId, relation } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0 && targetId.length > 0, "sourceId");
    H.domain(
      ["activation", "inhibition", "unknown"].includes(relation),
      "relation",
    );
    return {
      label: sourceId + " → " + targetId + " [" + relation + "]",
      sign: relation === "activation" ? 1 : relation === "inhibition" ? -1 : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceId: "A", targetId: "B", relation: "inhibition" },
  output: { label: "A → B [inhibition]", sign: -1 },
} satisfies ToolExample<Input, Output>;
export const regulatoryEdgeActivationInhibitionLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["computational-biology", "computational biology", "biology"],
        keywords: ["computational biology", "biology"],
      },
      id: "computational-biology/regulatory-edge-activation-inhibition-label",
      title: "Regulatory Edge Activation Inhibition Label",
      description:
        "Label an explicitly recorded regulatory edge and its sign without inferring biological interactions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceId: { type: "string", maxLength: 8192, minLength: 1 },
          targetId: { type: "string", maxLength: 8192, minLength: 1 },
          relation: {
            type: "string",
            maxLength: 8192,
            enum: ["activation", "inhibition", "unknown"],
          },
        },
        required: ["sourceId", "targetId", "relation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string", maxLength: 8192 },
          sign: { type: "integer" },
        },
        required: ["label", "sign"],
      },
      ports: {
        inputs: [
          {
            id: "sourceId",
            label: "Source Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "targetId",
            label: "Target Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "relation",
            label: "Relation",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
          { id: "sign", label: "Sign", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = regulatoryEdgeActivationInhibitionLabelTool.execute;
export default regulatoryEdgeActivationInhibitionLabelTool;
