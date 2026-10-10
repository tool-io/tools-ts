import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedStatusWording: string;
  readonly authoritySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedStatusWording: { type: "string", maxLength: 8192, minLength: 1 },
    authoritySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedStatusWording", "authoritySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit diplomatic-status wording and its authority source without determining immunity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedStatusWording, authoritySource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedStatusWording.length > 0, "suppliedStatusWording");
    H.domain(authoritySource.length > 0, "authoritySource");
    return {
      token: JSON.stringify([recordId, suppliedStatusWording, authoritySource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedStatusWording: "status recorded A",
    authoritySource: "Source A",
  },
  output: { token: '["R17","status recorded A","Source A"]' },
} satisfies ToolExample<Input, Output>;
export const diplomaticImmunitySourceStatusLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "international-relations",
          "international relations",
          "social sciences",
        ],
        keywords: ["international relations", "social sciences"],
      },
      id: "international-relations/diplomatic-immunity-source-status-label",
      title: "Diplomatic Immunity Source Status Label",
      description:
        "Preserve explicit diplomatic-status wording and its authority source without determining immunity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedStatusWording: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          authoritySource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "suppliedStatusWording", "authoritySource"],
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
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedStatusWording",
            label: "Supplied Status Wording",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "authoritySource",
            label: "Authority Source",
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
export const run = diplomaticImmunitySourceStatusLabelTool.execute;
export default diplomaticImmunitySourceStatusLabelTool;
