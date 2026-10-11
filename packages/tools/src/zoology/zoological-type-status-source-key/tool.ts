import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly suppliedTypeStatus: string;
  readonly authoritySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTypeStatus: { type: "string", maxLength: 8192, minLength: 1 },
    authoritySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "suppliedTypeStatus", "authoritySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit zoological nomenclatural type-status assertion and source without verifying designation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, suppliedTypeStatus, authoritySource } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(suppliedTypeStatus.length > 0, "suppliedTypeStatus");
    H.domain(authoritySource.length > 0, "authoritySource");
    return {
      token: JSON.stringify([specimenId, suppliedTypeStatus, authoritySource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "S17",
    suppliedTypeStatus: "holotype",
    authoritySource: "source A4",
  },
  output: { token: '["S17","holotype","source A4"]' },
} satisfies ToolExample<Input, Output>;
export const zoologicalTypeStatusSourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/zoological-type-status-source-key",
    title: "Zoological Type Status Source Key Tool",
    description:
      "Preserve an explicit zoological nomenclatural type-status assertion and source without verifying designation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedTypeStatus: { type: "string", maxLength: 8192, minLength: 1 },
        authoritySource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "suppliedTypeStatus", "authoritySource"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedTypeStatus",
          label: "Supplied Type Status",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = zoologicalTypeStatusSourceKeyTool.execute;
export default zoologicalTypeStatusSourceKeyTool;
