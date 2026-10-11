import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly testId: string;
  readonly methodWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    testId: { type: "string", maxLength: 8192, minLength: 1 },
    methodWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["testId", "methodWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit pharmacogenomic test-method label without inferring assay coverage or performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { testId, methodWording, source } = request;
  const compute = (): Output => {
    H.domain(testId.length > 0, "testId");
    H.domain(methodWording.length > 0, "methodWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([testId, methodWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { testId: "T17", methodWording: "targeted panel", source: "Lab A" },
  output: { token: '["T17","targeted panel","Lab A"]' },
} satisfies ToolExample<Input, Output>;
export const pharmacogenomicTestMethodLabelTool = H.defineSchemaCalculation<
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
    id: "pharmacogenomics/pharmacogenomic-test-method-label",
    title: "Pharmacogenomic Test Method Label",
    description:
      "Preserve an explicit pharmacogenomic test-method label without inferring assay coverage or performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        testId: { type: "string", maxLength: 8192, minLength: 1 },
        methodWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["testId", "methodWording", "source"],
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
          id: "methodWording",
          label: "Method Wording",
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
export const run = pharmacogenomicTestMethodLabelTool.execute;
export default pharmacogenomicTestMethodLabelTool;
