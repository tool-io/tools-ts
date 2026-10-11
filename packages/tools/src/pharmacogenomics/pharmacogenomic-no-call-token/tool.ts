import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly testId: string;
  readonly noCallWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    testId: { type: "string", maxLength: 8192, minLength: 1 },
    noCallWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["testId", "noCallWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit no-call wording and its source without treating it as a genotype. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { testId, noCallWording, source } = request;
  const compute = (): Output => {
    H.domain(testId.length > 0, "testId");
    H.domain(noCallWording.length > 0, "noCallWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([testId, noCallWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    testId: "T17",
    noCallWording: "insufficient signal",
    source: "Laboratory A",
  },
  output: { token: '["T17","insufficient signal","Laboratory A"]' },
} satisfies ToolExample<Input, Output>;
export const pharmacogenomicNocallTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacogenomics", "pharmacy"],
      keywords: ["pharmacogenomics", "pharmacy"],
    },
    id: "pharmacogenomics/pharmacogenomic-no-call-token",
    title: "Pharmacogenomic No Call Token",
    description:
      "Preserve explicit no-call wording and its source without treating it as a genotype.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        testId: { type: "string", maxLength: 8192, minLength: 1 },
        noCallWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["testId", "noCallWording", "source"],
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
          id: "testId",
          label: "Test Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "noCallWording",
          label: "No Call Wording",
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
export const run = pharmacogenomicNocallTokenTool.execute;
export default pharmacogenomicNocallTokenTool;
