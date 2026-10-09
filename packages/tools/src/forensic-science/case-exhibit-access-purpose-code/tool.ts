import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseId: string;
  readonly exhibitId: string;
  readonly suppliedPurpose: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseId: { type: "string", maxLength: 8192, minLength: 1 },
    exhibitId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPurpose: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["caseId", "exhibitId", "suppliedPurpose"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly supplied case-exhibit access purpose without authorizing access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseId, exhibitId, suppliedPurpose } = request;
  const compute = (): Output => {
    H.domain(caseId.length > 0, "caseId");
    H.domain(exhibitId.length > 0, "exhibitId");
    H.domain(suppliedPurpose.length > 0, "suppliedPurpose");
    return { token: JSON.stringify([caseId, exhibitId, suppliedPurpose]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { caseId: "C17", exhibitId: "E4", suppliedPurpose: "review" },
  output: { token: '["C17","E4","review"]' },
} satisfies ToolExample<Input, Output>;
export const caseExhibitAccessPurposeCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/case-exhibit-access-purpose-code",
    title: "Case Exhibit Access Purpose Code Tool",
    description:
      "Record an explicitly supplied case-exhibit access purpose without authorizing access.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseId: { type: "string", maxLength: 8192, minLength: 1 },
        exhibitId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPurpose: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["caseId", "exhibitId", "suppliedPurpose"],
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
          id: "caseId",
          label: "Case Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exhibitId",
          label: "Exhibit Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPurpose",
          label: "Supplied Purpose",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = caseExhibitAccessPurposeCodeTool.execute;
export default caseExhibitAccessPurposeCodeTool;
