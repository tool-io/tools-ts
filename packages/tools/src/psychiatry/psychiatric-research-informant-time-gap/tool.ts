import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly selfReportTime: number;
  readonly informantReportTime: number;
  readonly maximumComparableGap: number;
};
export type Output = {
  readonly signedGap: number;
  readonly absoluteGap: number;
  readonly withinWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selfReportTime: { type: "number" },
    informantReportTime: { type: "number" },
    maximumComparableGap: { type: "number", minimum: 0 },
  },
  required: ["selfReportTime", "informantReportTime", "maximumComparableGap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGap: { type: "number" },
    absoluteGap: { type: "number" },
    withinWindow: { type: "boolean" },
  },
  required: ["signedGap", "absoluteGap", "withinWindow"],
} as const;
/** Explicit temporal comparability audit for two research reports, without assessing an informant or clinical agreement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { selfReportTime, informantReportTime, maximumComparableGap } = request;
  const compute = (): Output => {
    H.domain(maximumComparableGap >= 0);
    return {
      signedGap: informantReportTime - selfReportTime,
      absoluteGap: Math.abs(informantReportTime - selfReportTime),
      withinWindow:
        Math.abs(informantReportTime - selfReportTime) <= maximumComparableGap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    selfReportTime: 10,
    informantReportTime: 14,
    maximumComparableGap: 3,
  },
  output: { signedGap: 4, absoluteGap: 4, withinWindow: false },
} satisfies ToolExample<Input, Output>;
export const psychiatricResearchInformantTimeGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "psychiatry/psychiatric-research-informant-time-gap",
      title: "Psychiatric Research Informant Time Gap Tool",
      description:
        "Explicit temporal comparability audit for two research reports, without assessing an informant or clinical agreement.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          selfReportTime: { type: "number" },
          informantReportTime: { type: "number" },
          maximumComparableGap: { type: "number", minimum: 0 },
        },
        required: [
          "selfReportTime",
          "informantReportTime",
          "maximumComparableGap",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedGap: { type: "number" },
          absoluteGap: { type: "number" },
          withinWindow: { type: "boolean" },
        },
        required: ["signedGap", "absoluteGap", "withinWindow"],
      },
      ports: {
        inputs: [
          {
            id: "selfReportTime",
            label: "Self Report Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "informantReportTime",
            label: "Informant Report Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maximumComparableGap",
            label: "Maximum Comparable Gap",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
          {
            id: "absoluteGap",
            label: "Absolute Gap",
            valueType: { type: "number" },
          },
          {
            id: "withinWindow",
            label: "Within Window",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = psychiatricResearchInformantTimeGapTool.execute;
export default psychiatricResearchInformantTimeGapTool;
