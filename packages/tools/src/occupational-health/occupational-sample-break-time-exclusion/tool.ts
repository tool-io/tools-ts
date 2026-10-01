import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shiftMinutes: number;
  readonly breaks: readonly number[];
  readonly overlappingBreakMinutes: number;
  readonly sampledBreakMinutes: number;
};
export type Output = {
  readonly excludedMinutes: number;
  readonly sampledMinutes: number;
  readonly sampleShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftMinutes: { type: "number", exclusiveMinimum: 0 },
    breaks: { type: "array", maxItems: 256, items: { type: "number" } },
    overlappingBreakMinutes: { type: "number", minimum: 0 },
    sampledBreakMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "shiftMinutes",
    "breaks",
    "overlappingBreakMinutes",
    "sampledBreakMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excludedMinutes: { type: "number" },
    sampledMinutes: { type: "number" },
    sampleShare: { type: "number" },
  },
  required: ["excludedMinutes", "sampledMinutes", "sampleShare"],
} as const;
/** Calculate occupational sample break time exclusion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shiftMinutes, breaks, overlappingBreakMinutes, sampledBreakMinutes } =
    request;
  const compute = (): Output => {
    H.positive(shiftMinutes);
    H.domain(
      breaks.every((x) => x >= 0) &&
        overlappingBreakMinutes >= 0 &&
        sampledBreakMinutes >= 0 &&
        overlappingBreakMinutes + sampledBreakMinutes <=
          breaks.reduce((a, b) => a + b, 0) &&
        breaks.reduce((a, b) => a + b, 0) -
          overlappingBreakMinutes -
          sampledBreakMinutes <=
          shiftMinutes,
    );
    return {
      excludedMinutes:
        breaks.reduce((a, b) => a + b, 0) -
        overlappingBreakMinutes -
        sampledBreakMinutes,
      sampledMinutes:
        shiftMinutes -
        breaks.reduce((a, b) => a + b, 0) +
        overlappingBreakMinutes +
        sampledBreakMinutes,
      sampleShare:
        (shiftMinutes -
          breaks.reduce((a, b) => a + b, 0) +
          overlappingBreakMinutes +
          sampledBreakMinutes) /
        shiftMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    shiftMinutes: 480,
    breaks: [30, 15],
    overlappingBreakMinutes: 5,
    sampledBreakMinutes: 10,
  },
  output: { excludedMinutes: 30, sampledMinutes: 450, sampleShare: 0.9375 },
} satisfies ToolExample<Input, Output>;
export const occupationalSampleBreakTimeExclusionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "occupational-health/occupational-sample-break-time-exclusion",
      title: "Occupational Sample Break Time Exclusion Tool",
      description:
        "Calculate occupational sample break time exclusion from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          shiftMinutes: { type: "number", exclusiveMinimum: 0 },
          breaks: { type: "array", maxItems: 256, items: { type: "number" } },
          overlappingBreakMinutes: { type: "number", minimum: 0 },
          sampledBreakMinutes: { type: "number", minimum: 0 },
        },
        required: [
          "shiftMinutes",
          "breaks",
          "overlappingBreakMinutes",
          "sampledBreakMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          excludedMinutes: { type: "number" },
          sampledMinutes: { type: "number" },
          sampleShare: { type: "number" },
        },
        required: ["excludedMinutes", "sampledMinutes", "sampleShare"],
      },
      ports: {
        inputs: [
          {
            id: "shiftMinutes",
            label: "Shift Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "breaks",
            label: "Breaks",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "overlappingBreakMinutes",
            label: "Overlapping Break Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampledBreakMinutes",
            label: "Sampled Break Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "excludedMinutes",
            label: "Excluded Minutes",
            valueType: { type: "number" },
          },
          {
            id: "sampledMinutes",
            label: "Sampled Minutes",
            valueType: { type: "number" },
          },
          {
            id: "sampleShare",
            label: "Sample Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = occupationalSampleBreakTimeExclusionTool.execute;
export default occupationalSampleBreakTimeExclusionTool;
