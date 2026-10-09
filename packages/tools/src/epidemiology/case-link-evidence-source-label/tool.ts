import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCaseId: string;
  readonly secondCaseId: string;
  readonly evidenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCaseId: { type: "string", maxLength: 8192, minLength: 1 },
    secondCaseId: { type: "string", maxLength: 8192, minLength: 1 },
    evidenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["firstCaseId", "secondCaseId", "evidenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an ordered supplied case-pair evidence source without establishing epidemiological linkage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCaseId, secondCaseId, evidenceSource } = request;
  const compute = (): Output => {
    H.domain(firstCaseId.length > 0, "firstCaseId");
    H.domain(secondCaseId.length > 0, "secondCaseId");
    H.domain(evidenceSource.length > 0, "evidenceSource");
    return {
      token: JSON.stringify([firstCaseId, secondCaseId, evidenceSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCaseId: "C17",
    secondCaseId: "C18",
    evidenceSource: "interview I4",
  },
  output: { token: '["C17","C18","interview I4"]' },
} satisfies ToolExample<Input, Output>;
export const caseLinkEvidenceSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/case-link-evidence-source-label",
    title: "Case Link Evidence Source Label Tool",
    description:
      "Record an ordered supplied case-pair evidence source without establishing epidemiological linkage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCaseId: { type: "string", maxLength: 8192, minLength: 1 },
        secondCaseId: { type: "string", maxLength: 8192, minLength: 1 },
        evidenceSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["firstCaseId", "secondCaseId", "evidenceSource"],
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
          id: "firstCaseId",
          label: "First Case Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondCaseId",
          label: "Second Case Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evidenceSource",
          label: "Evidence Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = caseLinkEvidenceSourceLabelTool.execute;
export default caseLinkEvidenceSourceLabelTool;
