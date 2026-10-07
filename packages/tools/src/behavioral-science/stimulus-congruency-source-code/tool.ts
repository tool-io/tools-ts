import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialId: string;
  readonly suppliedCongruency: string;
  readonly codingSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCongruency: { type: "string", maxLength: 8192, minLength: 1 },
    codingSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["trialId", "suppliedCongruency", "codingSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit stimulus congruency and coding-source metadata without inferring task conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialId, suppliedCongruency, codingSource } = request;
  const compute = (): Output => {
    H.domain(trialId.length > 0, "trialId");
    H.domain(suppliedCongruency.length > 0, "suppliedCongruency");
    H.domain(codingSource.length > 0, "codingSource");
    return {
      token: JSON.stringify([trialId, suppliedCongruency, codingSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trialId: "T17",
    suppliedCongruency: "congruent",
    codingSource: "protocol P4",
  },
  output: { token: '["T17","congruent","protocol P4"]' },
} satisfies ToolExample<Input, Output>;
export const stimulusCongruencySourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/stimulus-congruency-source-code",
    title: "Stimulus Congruency Source Code",
    description:
      "Preserve explicit stimulus congruency and coding-source metadata without inferring task conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedCongruency: { type: "string", maxLength: 8192, minLength: 1 },
        codingSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["trialId", "suppliedCongruency", "codingSource"],
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
          id: "trialId",
          label: "Trial Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCongruency",
          label: "Supplied Congruency",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codingSource",
          label: "Coding Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = stimulusCongruencySourceCodeTool.execute;
export default stimulusCongruencySourceCodeTool;
