import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly preservationWording: string;
  readonly recordSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    preservationWording: { type: "string", maxLength: 8192, minLength: 1 },
    recordSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "preservationWording", "recordSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record literal specimen-preservation wording and source without selecting a method or chemical concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, preservationWording, recordSource } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(preservationWording.length > 0, "preservationWording");
    H.domain(recordSource.length > 0, "recordSource");
    return {
      token: JSON.stringify([specimenId, preservationWording, recordSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "Z17",
    preservationWording: "dry preserved",
    recordSource: "Museum log",
  },
  output: { token: '["Z17","dry preserved","Museum log"]' },
} satisfies ToolExample<Input, Output>;
export const zoologyPreservationMethodTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["zoology", "biology"],
      keywords: ["zoology", "biology"],
    },
    id: "zoology/zoology-preservation-method-token",
    title: "Zoology Preservation Method Token",
    description:
      "Record literal specimen-preservation wording and source without selecting a method or chemical concentration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        preservationWording: { type: "string", maxLength: 8192, minLength: 1 },
        recordSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "preservationWording", "recordSource"],
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
          id: "preservationWording",
          label: "Preservation Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordSource",
          label: "Record Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = zoologyPreservationMethodTokenTool.execute;
export default zoologyPreservationMethodTokenTool;
