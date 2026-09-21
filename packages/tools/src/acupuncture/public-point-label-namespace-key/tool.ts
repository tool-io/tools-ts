import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceNamespace: string;
  readonly publicLabel: string;
  readonly sourceEdition: string;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceNamespace: { type: "string", maxLength: 8192 },
    publicLabel: { type: "string", maxLength: 8192 },
    sourceEdition: { type: "string", maxLength: 8192 },
  },
  required: ["sourceNamespace", "publicLabel", "sourceEdition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Qualify an explicitly supplied public historical label; no anatomical location or treatment guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceNamespace, publicLabel, sourceEdition } = request;
  const compute = (): Output => {
    H.domain(
      sourceNamespace.length > 0 &&
        publicLabel.length > 0 &&
        sourceEdition.length > 0,
    );
    return {
      key: JSON.stringify([sourceNamespace, sourceEdition, publicLabel]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceNamespace: "sourceA",
    publicLabel: "label1",
    sourceEdition: "ed2",
  },
  output: { key: '["sourceA","ed2","label1"]' },
} satisfies ToolExample<Input, Output>;
export const publicPointLabelNamespaceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "acupuncture/public-point-label-namespace-key",
    title: "Public Point Label Namespace Key Tool",
    description:
      "Qualify an explicitly supplied public historical label; no anatomical location or treatment guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceNamespace: { type: "string", maxLength: 8192 },
        publicLabel: { type: "string", maxLength: 8192 },
        sourceEdition: { type: "string", maxLength: 8192 },
      },
      required: ["sourceNamespace", "publicLabel", "sourceEdition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "sourceNamespace",
          label: "Source Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "publicLabel",
          label: "Public Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceEdition",
          label: "Source Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicPointLabelNamespaceKeyTool.execute;
export default publicPointLabelNamespaceKeyTool;
