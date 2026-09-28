import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly straightLength: number;
  readonly curvedLength: number;
  readonly reportCurved: boolean;
};
export type Output = {
  readonly reportedLength: number;
  readonly pathDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    straightLength: { type: "number", minimum: 0 },
    curvedLength: { type: "number" },
    reportCurved: { type: "boolean" },
  },
  required: ["straightLength", "curvedLength", "reportCurved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedLength: { type: "number" },
    pathDifference: { type: "number" },
  },
  required: ["reportedLength", "pathDifference"],
} as const;
/** Select explicitly supplied straight or curved measurement paths without a species-specific conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { straightLength, curvedLength, reportCurved } = request;
  const compute = (): Output => {
    H.domain(straightLength >= 0 && curvedLength >= straightLength);
    return {
      reportedLength: reportCurved ? curvedLength : straightLength,
      pathDifference: curvedLength - straightLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { straightLength: 10, curvedLength: 12, reportCurved: true },
  output: { reportedLength: 12, pathDifference: 2 },
} satisfies ToolExample<Input, Output>;
export const carapaceMeasurePathBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/carapace-measure-path-base-flag",
    title: "Carapace Measure Path Base Flag Tool",
    description:
      "Select explicitly supplied straight or curved measurement paths without a species-specific conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        straightLength: { type: "number", minimum: 0 },
        curvedLength: { type: "number" },
        reportCurved: { type: "boolean" },
      },
      required: ["straightLength", "curvedLength", "reportCurved"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedLength: { type: "number" },
        pathDifference: { type: "number" },
      },
      required: ["reportedLength", "pathDifference"],
    },
    ports: {
      inputs: [
        {
          id: "straightLength",
          label: "Straight Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "curvedLength",
          label: "Curved Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportCurved",
          label: "Report Curved",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reportedLength",
          label: "Reported Length",
          valueType: { type: "number" },
        },
        {
          id: "pathDifference",
          label: "Path Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = carapaceMeasurePathBaseFlagTool.execute;
export default carapaceMeasurePathBaseFlagTool;
