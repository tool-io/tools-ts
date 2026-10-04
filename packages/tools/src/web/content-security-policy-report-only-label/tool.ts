import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly headerName: string };
export type Output = {
  readonly reportOnly: boolean;
  readonly recognized: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { headerName: { type: "string", maxLength: 8192 } },
  required: ["headerName"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportOnly: { type: "boolean" },
    recognized: { type: "boolean" },
  },
  required: ["reportOnly", "recognized"],
} as const;
/** Compute content security policy report only label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { headerName } = input;
  const compute = (): Output => {
    const name = headerName.toLowerCase();
    return {
      reportOnly: name === "content-security-policy-report-only",
      recognized: [
        "content-security-policy",
        "content-security-policy-report-only",
      ].includes(name),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { headerName: "Content-Security-Policy-Report-Only" },
  output: { reportOnly: true, recognized: true },
} satisfies ToolExample<Input, Output>;
export const contentSecurityPolicyReportOnlyLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/content-security-policy-report-only-label",
  title: "Content Security Policy Report Only Label Tool",
  description:
    "Compute content security policy report only label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "headerName",
        label: "Header Name",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "reportOnly",
        label: "Report Only",
        valueType: { type: "boolean" },
      },
      { id: "recognized", label: "Recognized", valueType: { type: "boolean" } },
    ],
  },
});
export const run = contentSecurityPolicyReportOnlyLabelTool.execute;
export default contentSecurityPolicyReportOnlyLabelTool;
