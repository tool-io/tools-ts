import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exhibitId: string;
  readonly fromContainer: string;
  readonly toContainer: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exhibitId: { type: "string", maxLength: 8192, minLength: 1 },
    fromContainer: { type: "string", maxLength: 8192, minLength: 1 },
    toContainer: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["exhibitId", "fromContainer", "toContainer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit evidence-container transfer identifiers without verifying custody or integrity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exhibitId, fromContainer, toContainer } = request;
  const compute = (): Output => {
    H.domain(exhibitId.length > 0, "exhibitId");
    H.domain(fromContainer.length > 0, "fromContainer");
    H.domain(toContainer.length > 0, "toContainer");
    return { token: JSON.stringify([exhibitId, fromContainer, toContainer]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exhibitId: "EX17", fromContainer: "BOX-A", toContainer: "TUBE-2" },
  output: { token: '["EX17","BOX-A","TUBE-2"]' },
} satisfies ToolExample<Input, Output>;
export const evidenceContainerTransferLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "forensic-science",
        "forensic science",
        "research and quality management",
      ],
      keywords: ["forensic science", "research and quality management"],
    },
    id: "forensic-science/evidence-container-transfer-label",
    title: "Evidence Container Transfer Label",
    description:
      "Record explicit evidence-container transfer identifiers without verifying custody or integrity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exhibitId: { type: "string", maxLength: 8192, minLength: 1 },
        fromContainer: { type: "string", maxLength: 8192, minLength: 1 },
        toContainer: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["exhibitId", "fromContainer", "toContainer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "exhibitId",
          label: "Exhibit Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fromContainer",
          label: "From Container",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "toContainer",
          label: "To Container",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = evidenceContainerTransferLabelTool.execute;
export default evidenceContainerTransferLabelTool;
