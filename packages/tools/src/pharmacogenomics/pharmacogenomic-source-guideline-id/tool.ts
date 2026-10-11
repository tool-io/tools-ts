import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly guidelineId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    guidelineId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "guidelineId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit guideline identifier by version without retrieving or applying treatment recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, guidelineId, version } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(guidelineId.length > 0, "guidelineId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([recordId, guidelineId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", guidelineId: "GUIDE-A", version: "v2" },
  output: { token: '["R17","GUIDE-A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const pharmacogenomicSourceGuidelineIdTool = H.defineSchemaCalculation<
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
    id: "pharmacogenomics/pharmacogenomic-source-guideline-id",
    title: "Pharmacogenomic Source Guideline ID",
    description:
      "Qualify an explicit guideline identifier by version without retrieving or applying treatment recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        guidelineId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "guidelineId", "version"],
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
          id: "guidelineId",
          label: "Guideline Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pharmacogenomicSourceGuidelineIdTool.execute;
export default pharmacogenomicSourceGuidelineIdTool;
