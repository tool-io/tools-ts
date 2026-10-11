import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly gasPhase: string;
  readonly referenceBasis: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    gasPhase: { type: "string", maxLength: 8192, minLength: 1 },
    referenceBasis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "gasPhase", "referenceBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Label explicit gas-phase and reference-basis wording without gas-state conversion or physiological interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, gasPhase, referenceBasis } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(gasPhase.length > 0, "gasPhase");
    H.domain(referenceBasis.length > 0, "referenceBasis");
    return { token: JSON.stringify([sampleId, gasPhase, referenceBasis]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", gasPhase: "expired", referenceBasis: "dry STPD" },
  output: { token: '["S17","expired","dry STPD"]' },
} satisfies ToolExample<Input, Output>;
export const gasExchangeExpiredinspiredReferenceLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["physiology", "biology"],
        keywords: ["physiology", "biology"],
      },
      id: "physiology/gas-exchange-expired-inspired-reference-label",
      title: "Gas Exchange Expired Inspired Reference Label",
      description:
        "Label explicit gas-phase and reference-basis wording without gas-state conversion or physiological interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleId: { type: "string", maxLength: 8192, minLength: 1 },
          gasPhase: { type: "string", maxLength: 8192, minLength: 1 },
          referenceBasis: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["sampleId", "gasPhase", "referenceBasis"],
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
            id: "sampleId",
            label: "Sample Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "gasPhase",
            label: "Gas Phase",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "referenceBasis",
            label: "Reference Basis",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = gasExchangeExpiredinspiredReferenceLabelTool.execute;
export default gasExchangeExpiredinspiredReferenceLabelTool;
