import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interviewId: string;
  readonly suppliedPurpose: string;
  readonly permissionRecorded: boolean;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interviewId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPurpose: { type: "string", maxLength: 8192, minLength: 1 },
    permissionRecorded: { type: "boolean" },
  },
  required: ["interviewId", "suppliedPurpose", "permissionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit oral-history release purpose and permission flag without determining consent validity or rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interviewId, suppliedPurpose, permissionRecorded } = request;
  const compute = (): Output => {
    H.domain(
      interviewId.length > 0 && suppliedPurpose.length > 0,
      "interviewId",
    );
    return {
      token: JSON.stringify([interviewId, suppliedPurpose, permissionRecorded]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    interviewId: "INT17",
    suppliedPurpose: "analysis",
    permissionRecorded: true,
  },
  output: { token: '["INT17","analysis",true]' },
} satisfies ToolExample<Input, Output>;
export const americanOralHistoryReleasePurposeFieldTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["american-studies", "american studies", "humanities"],
        keywords: ["american studies", "humanities"],
      },
      id: "american-studies/american-oral-history-release-purpose-field",
      title: "American Oral History Release Purpose Field",
      description:
        "Record an explicit oral-history release purpose and permission flag without determining consent validity or rights.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          interviewId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedPurpose: { type: "string", maxLength: 8192, minLength: 1 },
          permissionRecorded: { type: "boolean" },
        },
        required: ["interviewId", "suppliedPurpose", "permissionRecorded"],
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
            id: "interviewId",
            label: "Interview Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedPurpose",
            label: "Supplied Purpose",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "permissionRecorded",
            label: "Permission Recorded",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = americanOralHistoryReleasePurposeFieldTool.execute;
export default americanOralHistoryReleasePurposeFieldTool;
