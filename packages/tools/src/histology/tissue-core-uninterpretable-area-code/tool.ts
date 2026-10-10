import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coreId: string;
  readonly suppliedAreaCode: string;
  readonly reasonSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coreId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAreaCode: { type: "string", maxLength: 8192, minLength: 1 },
    reasonSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["coreId", "suppliedAreaCode", "reasonSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit tissue-core interpretability metadata and source without evaluating tissue or diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coreId, suppliedAreaCode, reasonSource } = request;
  const compute = (): Output => {
    H.domain(coreId.length > 0, "coreId");
    H.domain(suppliedAreaCode.length > 0, "suppliedAreaCode");
    H.domain(reasonSource.length > 0, "reasonSource");
    return { token: JSON.stringify([coreId, suppliedAreaCode, reasonSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coreId: "C17",
    suppliedAreaCode: "uninterpretable",
    reasonSource: "reader R4",
  },
  output: { token: '["C17","uninterpretable","reader R4"]' },
} satisfies ToolExample<Input, Output>;
export const tissueCoreUninterpretableAreaCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/tissue-core-uninterpretable-area-code",
    title: "Tissue Core Uninterpretable Area Code Tool",
    description:
      "Preserve explicit tissue-core interpretability metadata and source without evaluating tissue or diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coreId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAreaCode: { type: "string", maxLength: 8192, minLength: 1 },
        reasonSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["coreId", "suppliedAreaCode", "reasonSource"],
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
          id: "coreId",
          label: "Core Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAreaCode",
          label: "Supplied Area Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reasonSource",
          label: "Reason Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = tissueCoreUninterpretableAreaCodeTool.execute;
export default tissueCoreUninterpretableAreaCodeTool;
