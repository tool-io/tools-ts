import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activeSessions: number;
  readonly comparatorSessions: number;
  readonly activeMinutes: number;
  readonly comparatorMinutes: number;
};
export type Output = {
  readonly activeExposure: number;
  readonly comparatorExposure: number;
  readonly exposureGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeSessions: { type: "integer", minimum: 0 },
    comparatorSessions: { type: "integer", minimum: 0 },
    activeMinutes: { type: "number", minimum: 0 },
    comparatorMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "activeSessions",
    "comparatorSessions",
    "activeMinutes",
    "comparatorMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeExposure: { type: "number" },
    comparatorExposure: { type: "number" },
    exposureGap: { type: "number" },
  },
  required: ["activeExposure", "comparatorExposure", "exposureGap"],
} as const;
/** Audit supplied study contact exposure without attributing efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    activeSessions,
    comparatorSessions,
    activeMinutes,
    comparatorMinutes,
  } = request;
  const compute = (): Output => {
    H.integer(activeSessions, 0);
    H.integer(comparatorSessions, 0);
    H.domain(activeMinutes >= 0 && comparatorMinutes >= 0);
    return {
      activeExposure: activeSessions * activeMinutes,
      comparatorExposure: comparatorSessions * comparatorMinutes,
      exposureGap:
        activeSessions * activeMinutes - comparatorSessions * comparatorMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activeSessions: 6,
    comparatorSessions: 4,
    activeMinutes: 30,
    comparatorMinutes: 40,
  },
  output: { activeExposure: 180, comparatorExposure: 160, exposureGap: 20 },
} satisfies ToolExample<Input, Output>;
export const naturopathyStudyComparatorExposureGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "naturopathy/naturopathy-study-comparator-exposure-gap",
      title: "Naturopathy Study Comparator Exposure Gap Tool",
      description:
        "Audit supplied study contact exposure without attributing efficacy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activeSessions: { type: "integer", minimum: 0 },
          comparatorSessions: { type: "integer", minimum: 0 },
          activeMinutes: { type: "number", minimum: 0 },
          comparatorMinutes: { type: "number", minimum: 0 },
        },
        required: [
          "activeSessions",
          "comparatorSessions",
          "activeMinutes",
          "comparatorMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activeExposure: { type: "number" },
          comparatorExposure: { type: "number" },
          exposureGap: { type: "number" },
        },
        required: ["activeExposure", "comparatorExposure", "exposureGap"],
      },
      ports: {
        inputs: [
          {
            id: "activeSessions",
            label: "Active Sessions",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "comparatorSessions",
            label: "Comparator Sessions",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "activeMinutes",
            label: "Active Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "comparatorMinutes",
            label: "Comparator Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "activeExposure",
            label: "Active Exposure",
            valueType: { type: "number" },
          },
          {
            id: "comparatorExposure",
            label: "Comparator Exposure",
            valueType: { type: "number" },
          },
          {
            id: "exposureGap",
            label: "Exposure Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = naturopathyStudyComparatorExposureGapTool.execute;
export default naturopathyStudyComparatorExposureGapTool;
