import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportId: string;
  readonly amended: boolean;
  readonly supersededVersion: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportId: { type: "string", maxLength: 8192, minLength: 1 },
    amended: { type: "boolean" },
    supersededVersion: { type: "string", maxLength: 8192 },
  },
  required: ["reportId", "amended", "supersededVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit report-amendment flag and prior version without determining amendment rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportId, amended, supersededVersion } = request;
  const compute = (): Output => {
    H.domain(reportId.length > 0, "reportId");
    H.domain(!amended || supersededVersion.length > 0, "supersededVersion");
    return {
      label:
        reportId +
        " [" +
        (amended
          ? "amended; supersedes " + supersededVersion
          : "not marked amended") +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportId: "R17", amended: true, supersededVersion: "v1" },
  output: { label: "R17 [amended; supersedes v1]" },
} satisfies ToolExample<Input, Output>;
export const pathologyAmendedStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pathology", "health and medicine"],
      keywords: ["pathology", "health and medicine"],
    },
    id: "pathology/pathology-amended-status-label",
    title: "Pathology Amended Status Label",
    description:
      "Label an explicit report-amendment flag and prior version without determining amendment rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportId: { type: "string", maxLength: 8192, minLength: 1 },
        amended: { type: "boolean" },
        supersededVersion: { type: "string", maxLength: 8192 },
      },
      required: ["reportId", "amended", "supersededVersion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
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
          id: "amended",
          label: "Amended",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "supersededVersion",
          label: "Superseded Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pathologyAmendedStatusLabelTool.execute;
export default pathologyAmendedStatusLabelTool;
