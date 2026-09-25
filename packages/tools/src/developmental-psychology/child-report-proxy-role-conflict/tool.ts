import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reporterRole: string;
  readonly childReport: boolean;
  readonly proxyReport: boolean;
};
export type Output = {
  readonly conflict: boolean;
  readonly recognizedRole: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reporterRole: { type: "string", maxLength: 8192, enum: ["child", "proxy"] },
    childReport: { type: "boolean" },
    proxyReport: { type: "boolean" },
  },
  required: ["reporterRole", "childReport", "proxyReport"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conflict: { type: "boolean" },
    recognizedRole: { type: "boolean" },
  },
  required: ["conflict", "recognizedRole"],
} as const;
/** Audit inconsistent supplied reporter-role metadata, without rating report validity or a child. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reporterRole, childReport, proxyReport } = request;
  const compute = (): Output => {
    return {
      conflict:
        (childReport && proxyReport) ||
        (reporterRole === "child" && proxyReport) ||
        (reporterRole === "proxy" && childReport),
      recognizedRole: ["child", "proxy"].includes(reporterRole),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reporterRole: "child", childReport: true, proxyReport: false },
  output: { conflict: false, recognizedRole: true },
} satisfies ToolExample<Input, Output>;
export const childReportProxyRoleConflictTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/child-report-proxy-role-conflict",
    title: "Child Report Proxy Role Conflict Tool",
    description:
      "Audit inconsistent supplied reporter-role metadata, without rating report validity or a child.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reporterRole: {
          type: "string",
          maxLength: 8192,
          enum: ["child", "proxy"],
        },
        childReport: { type: "boolean" },
        proxyReport: { type: "boolean" },
      },
      required: ["reporterRole", "childReport", "proxyReport"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conflict: { type: "boolean" },
        recognizedRole: { type: "boolean" },
      },
      required: ["conflict", "recognizedRole"],
    },
    ports: {
      inputs: [
        {
          id: "reporterRole",
          label: "Reporter Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "childReport",
          label: "Child Report",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "proxyReport",
          label: "Proxy Report",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "conflict", label: "Conflict", valueType: { type: "boolean" } },
        {
          id: "recognizedRole",
          label: "Recognized Role",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = childReportProxyRoleConflictTool.execute;
export default childReportProxyRoleConflictTool;
