import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observanceId: string;
  readonly suppliedTransferWording: string;
  readonly sourceEdition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observanceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTransferWording: { type: "string", maxLength: 8192, minLength: 1 },
    sourceEdition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observanceId", "suppliedTransferWording", "sourceEdition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit feast-transfer wording and lectionary edition without applying denominational rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observanceId, suppliedTransferWording, sourceEdition } = request;
  const compute = (): Output => {
    H.domain(observanceId.length > 0, "observanceId");
    H.domain(suppliedTransferWording.length > 0, "suppliedTransferWording");
    H.domain(sourceEdition.length > 0, "sourceEdition");
    return {
      token: JSON.stringify([
        observanceId,
        suppliedTransferWording,
        sourceEdition,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observanceId: "O17",
    suppliedTransferWording: "transfer recorded A",
    sourceEdition: "Edition A",
  },
  output: { token: '["O17","transfer recorded A","Edition A"]' },
} satisfies ToolExample<Input, Output>;
export const lectionaryFeastTransferSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["religious-studies", "religious studies", "humanities"],
      keywords: ["religious studies", "humanities"],
    },
    id: "religious-studies/lectionary-feast-transfer-source-label",
    title: "Lectionary Feast Transfer Source Label",
    description:
      "Preserve explicit feast-transfer wording and lectionary edition without applying denominational rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observanceId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedTransferWording: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        sourceEdition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observanceId", "suppliedTransferWording", "sourceEdition"],
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
          id: "observanceId",
          label: "Observance Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedTransferWording",
          label: "Supplied Transfer Wording",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = lectionaryFeastTransferSourceLabelTool.execute;
export default lectionaryFeastTransferSourceLabelTool;
