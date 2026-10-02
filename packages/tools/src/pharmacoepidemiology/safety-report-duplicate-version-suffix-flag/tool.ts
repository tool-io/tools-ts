import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportId: string;
  readonly suffix: string;
  readonly knownReportIds: readonly string[];
  readonly knownSuffixes: readonly string[];
};
export type Output = {
  readonly duplicateVersion: boolean;
  readonly priorReport: boolean;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportId: { type: "string", maxLength: 8192 },
    suffix: { type: "string", maxLength: 8192 },
    knownReportIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    knownSuffixes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["reportId", "suffix", "knownReportIds", "knownSuffixes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duplicateVersion: { type: "boolean" },
    priorReport: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["duplicateVersion", "priorReport", "key"],
} as const;
/** Compare exact report/version pairs without treating updates as independent safety cases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportId, suffix, knownReportIds, knownSuffixes } = request;
  const compute = (): Output => {
    H.sameLength(knownReportIds, knownSuffixes);
    return {
      duplicateVersion: knownReportIds.some(
        (x, i) => x === reportId && knownSuffixes[i] === suffix,
      ),
      priorReport: knownReportIds.includes(reportId),
      key: JSON.stringify([reportId, suffix]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportId: "R1",
    suffix: "v2",
    knownReportIds: ["R1", "R1"],
    knownSuffixes: ["v1", "v2"],
  },
  output: { duplicateVersion: true, priorReport: true, key: '["R1","v2"]' },
} satisfies ToolExample<Input, Output>;
export const safetyReportDuplicateVersionSuffixFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacoepidemiology/safety-report-duplicate-version-suffix-flag",
      title: "Safety Report Duplicate Version Suffix Flag Tool",
      description:
        "Compare exact report/version pairs without treating updates as independent safety cases.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reportId: { type: "string", maxLength: 8192 },
          suffix: { type: "string", maxLength: 8192 },
          knownReportIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          knownSuffixes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["reportId", "suffix", "knownReportIds", "knownSuffixes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          duplicateVersion: { type: "boolean" },
          priorReport: { type: "boolean" },
          key: { type: "string", maxLength: 8192 },
        },
        required: ["duplicateVersion", "priorReport", "key"],
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
            id: "suffix",
            label: "Suffix",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "knownReportIds",
            label: "Known Report Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "knownSuffixes",
            label: "Known Suffixes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "duplicateVersion",
            label: "Duplicate Version",
            valueType: { type: "boolean" },
          },
          {
            id: "priorReport",
            label: "Prior Report",
            valueType: { type: "boolean" },
          },
          { id: "key", label: "Key", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = safetyReportDuplicateVersionSuffixFlagTool.execute;
export default safetyReportDuplicateVersionSuffixFlagTool;
