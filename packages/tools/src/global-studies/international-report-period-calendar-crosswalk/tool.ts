import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourcePeriodText: string;
  readonly targetPeriodText: string;
  readonly suppliedCalendarConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourcePeriodText: { type: "string", maxLength: 8192, minLength: 1 },
    targetPeriodText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCalendarConvention: {
      type: "string",
      maxLength: 8192,
      minLength: 1,
    },
  },
  required: [
    "sourcePeriodText",
    "targetPeriodText",
    "suppliedCalendarConvention",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit reporting-period crosswalk and calendar convention without generating fiscal or local-calendar mappings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourcePeriodText, targetPeriodText, suppliedCalendarConvention } =
    request;
  const compute = (): Output => {
    H.domain(sourcePeriodText.length > 0, "sourcePeriodText");
    H.domain(targetPeriodText.length > 0, "targetPeriodText");
    H.domain(
      suppliedCalendarConvention.length > 0,
      "suppliedCalendarConvention",
    );
    return {
      token: JSON.stringify([
        sourcePeriodText,
        targetPeriodText,
        suppliedCalendarConvention,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourcePeriodText: "2025/26",
    targetPeriodText: "2026",
    suppliedCalendarConvention: "fiscal ending year",
  },
  output: { token: '["2025/26","2026","fiscal ending year"]' },
} satisfies ToolExample<Input, Output>;
export const internationalReportPeriodCalendarCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/international-report-period-calendar-crosswalk",
      title: "International Report Period Calendar Crosswalk Tool",
      description:
        "Record an explicit reporting-period crosswalk and calendar convention without generating fiscal or local-calendar mappings.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourcePeriodText: { type: "string", maxLength: 8192, minLength: 1 },
          targetPeriodText: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedCalendarConvention: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: [
          "sourcePeriodText",
          "targetPeriodText",
          "suppliedCalendarConvention",
        ],
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
            id: "sourcePeriodText",
            label: "Source Period Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "targetPeriodText",
            label: "Target Period Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedCalendarConvention",
            label: "Supplied Calendar Convention",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = internationalReportPeriodCalendarCrosswalkTool.execute;
export default internationalReportPeriodCalendarCrosswalkTool;
