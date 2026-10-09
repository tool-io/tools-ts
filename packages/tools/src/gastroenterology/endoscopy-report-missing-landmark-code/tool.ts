import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportId: string;
  readonly landmarkId: string;
  readonly suppliedMissingReason: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportId: { type: "string", maxLength: 8192, minLength: 1 },
    landmarkId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedMissingReason: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["reportId", "landmarkId", "suppliedMissingReason"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied endoscopy report missing-landmark reason without inferring anatomy or procedural completeness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportId, landmarkId, suppliedMissingReason } = request;
  const compute = (): Output => {
    H.domain(reportId.length > 0, "reportId");
    H.domain(landmarkId.length > 0, "landmarkId");
    H.domain(suppliedMissingReason.length > 0, "suppliedMissingReason");
    return {
      token: JSON.stringify([reportId, landmarkId, suppliedMissingReason]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportId: "R17",
    landmarkId: "L4",
    suppliedMissingReason: "not visualized",
  },
  output: { token: '["R17","L4","not visualized"]' },
} satisfies ToolExample<Input, Output>;
export const endoscopyReportMissingLandmarkCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/endoscopy-report-missing-landmark-code",
    title: "Endoscopy Report Missing Landmark Code Tool",
    description:
      "Preserve a supplied endoscopy report missing-landmark reason without inferring anatomy or procedural completeness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportId: { type: "string", maxLength: 8192, minLength: 1 },
        landmarkId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedMissingReason: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["reportId", "landmarkId", "suppliedMissingReason"],
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
          id: "reportId",
          label: "Report Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "landmarkId",
          label: "Landmark Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedMissingReason",
          label: "Supplied Missing Reason",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = endoscopyReportMissingLandmarkCodeTool.execute;
export default endoscopyReportMissingLandmarkCodeTool;
