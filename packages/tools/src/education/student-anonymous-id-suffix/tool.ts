import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyNamespace: string;
  readonly suppliedAnonymousId: string;
  readonly suffix: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyNamespace: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAnonymousId: { type: "string", maxLength: 8192, minLength: 1 },
    suffix: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyNamespace", "suppliedAnonymousId", "suffix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous key from supplied anonymous student identifiers without generating anonymity or accessing identity records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyNamespace, suppliedAnonymousId, suffix } = request;
  const compute = (): Output => {
    H.domain(studyNamespace.length > 0, "studyNamespace");
    H.domain(suppliedAnonymousId.length > 0, "suppliedAnonymousId");
    H.domain(suffix.length > 0, "suffix");
    return {
      token: JSON.stringify([studyNamespace, suppliedAnonymousId, suffix]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyNamespace: "ST17", suppliedAnonymousId: "P002", suffix: "B" },
  output: { token: '["ST17","P002","B"]' },
} satisfies ToolExample<Input, Output>;
export const studentAnonymousIdSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["education"],
      keywords: ["education"],
    },
    id: "education/student-anonymous-id-suffix",
    title: "Student Anonymous ID Suffix",
    description:
      "Build an unambiguous key from supplied anonymous student identifiers without generating anonymity or accessing identity records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyNamespace: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAnonymousId: { type: "string", maxLength: 8192, minLength: 1 },
        suffix: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyNamespace", "suppliedAnonymousId", "suffix"],
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
          id: "studyNamespace",
          label: "Study Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAnonymousId",
          label: "Supplied Anonymous Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suffix",
          label: "Suffix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = studentAnonymousIdSuffixTool.execute;
export default studentAnonymousIdSuffixTool;
