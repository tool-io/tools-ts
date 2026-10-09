import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localCode: string;
  readonly loincCode: string;
  readonly mappingSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localCode: { type: "string", maxLength: 8192, minLength: 1 },
    loincCode: { type: "string", maxLength: 8192, minLength: 1 },
    mappingSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["localCode", "loincCode", "mappingSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an asserted local-to-LOINC mapping and source without verifying a LOINC code or semantic equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localCode, loincCode, mappingSource } = request;
  const compute = (): Output => {
    H.domain(localCode.length > 0, "localCode");
    H.domain(loincCode.length > 0, "loincCode");
    H.domain(mappingSource.length > 0, "mappingSource");
    return { token: JSON.stringify([localCode, loincCode, mappingSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    localCode: "LAB17",
    loincCode: "1234-5",
    mappingSource: "Mapping v2",
  },
  output: { token: '["LAB17","1234-5","Mapping v2"]' },
} satisfies ToolExample<Input, Output>;
export const loincLocalCodeSourceLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "health-informatics",
        "health informatics",
        "research and quality management",
      ],
      keywords: ["health informatics", "research and quality management"],
    },
    id: "health-informatics/loinc-local-code-source-link",
    title: "LOINC Local Code Source Link",
    description:
      "Record an asserted local-to-LOINC mapping and source without verifying a LOINC code or semantic equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localCode: { type: "string", maxLength: 8192, minLength: 1 },
        loincCode: { type: "string", maxLength: 8192, minLength: 1 },
        mappingSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["localCode", "loincCode", "mappingSource"],
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
          id: "localCode",
          label: "Local Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "loincCode",
          label: "Loinc Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mappingSource",
          label: "Mapping Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = loincLocalCodeSourceLinkTool.execute;
export default loincLocalCodeSourceLinkTool;
