import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reasonCode: string;
  readonly codeSystem: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reasonCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSystem: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["reasonCode", "codeSystem"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied absent-reason code by its code system without choosing a reason or checking a terminology server. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reasonCode, codeSystem } = request;
  const compute = (): Output => {
    H.domain(reasonCode.length > 0 && codeSystem.length > 0, "reasonCode");
    return { token: JSON.stringify([codeSystem, reasonCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reasonCode: "unknown",
    codeSystem: "http://terminology.hl7.org/CodeSystem/data-absent-reason",
  },
  output: {
    token:
      '["http://terminology.hl7.org/CodeSystem/data-absent-reason","unknown"]',
  },
} satisfies ToolExample<Input, Output>;
export const fhirAbsentReasonTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "health-informatics",
        "health informatics",
        "research and quality management",
      ],
      keywords: ["health informatics", "research and quality management"],
    },
    id: "health-informatics/fhir-absent-reason-token",
    title: "FHIR Absent Reason Token",
    description:
      "Qualify a supplied absent-reason code by its code system without choosing a reason or checking a terminology server.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reasonCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSystem: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["reasonCode", "codeSystem"],
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
          id: "reasonCode",
          label: "Reason Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSystem",
          label: "Code System",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fhirAbsentReasonTokenTool.execute;
export default fhirAbsentReasonTokenTool;
