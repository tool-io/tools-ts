import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interventionId: string;
  readonly acceptanceCode: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interventionId: { type: "string", maxLength: 8192, minLength: 1 },
    acceptanceCode: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["interventionId", "acceptanceCode", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied intervention acceptance code and source without assessing clinical appropriateness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interventionId, acceptanceCode, source } = request;
  const compute = (): Output => {
    H.domain(interventionId.length > 0, "interventionId");
    H.domain(acceptanceCode.length > 0, "acceptanceCode");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([interventionId, acceptanceCode, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    interventionId: "I17",
    acceptanceCode: "accepted",
    source: "Service codebook",
  },
  output: { token: '["I17","accepted","Service codebook"]' },
} satisfies ToolExample<Input, Output>;
export const pharmacyInterventionAcceptanceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["clinical-pharmacy", "clinical pharmacy", "pharmacy"],
      keywords: ["clinical pharmacy", "pharmacy"],
    },
    id: "clinical-pharmacy/pharmacy-intervention-acceptance-code",
    title: "Pharmacy Intervention Acceptance Code",
    description:
      "Preserve a supplied intervention acceptance code and source without assessing clinical appropriateness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interventionId: { type: "string", maxLength: 8192, minLength: 1 },
        acceptanceCode: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["interventionId", "acceptanceCode", "source"],
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
          id: "interventionId",
          label: "Intervention Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "acceptanceCode",
          label: "Acceptance Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pharmacyInterventionAcceptanceCodeTool.execute;
export default pharmacyInterventionAcceptanceCodeTool;
