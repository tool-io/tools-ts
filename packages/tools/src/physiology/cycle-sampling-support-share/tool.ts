import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cycleIds: readonly string[];
  readonly sampleDurations: readonly number[];
  readonly valid: readonly boolean[];
  readonly selectedCycle: string;
  readonly expectedDuration: number;
};
export type Output = {
  readonly supportedDuration: number;
  readonly recordedDuration: number;
  readonly expectedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sampleDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedCycle: { type: "string", maxLength: 8192 },
    expectedDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "cycleIds",
    "sampleDurations",
    "valid",
    "selectedCycle",
    "expectedDuration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportedDuration: { type: "number" },
    recordedDuration: { type: "number" },
    expectedShare: { type: "number" },
  },
  required: ["supportedDuration", "recordedDuration", "expectedShare"],
} as const;
/** Calculate cycle sampling support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cycleIds, sampleDurations, valid, selectedCycle, expectedDuration } =
    request;
  const compute = (): Output => {
    H.sameLength(cycleIds, sampleDurations);
    H.sameLength(cycleIds, valid);
    H.domain(sampleDurations.every((x) => x >= 0));
    H.positive(expectedDuration);
    return (() => {
      const recordedDuration = sampleDurations.reduce(
          (s, x, i) => s + (cycleIds[i] === selectedCycle ? x : 0),
          0,
        ),
        supportedDuration = sampleDurations.reduce(
          (s, x, i) => s + (cycleIds[i] === selectedCycle && valid[i] ? x : 0),
          0,
        );
      return {
        supportedDuration,
        recordedDuration,
        expectedShare: supportedDuration / expectedDuration,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cycleIds: ["A", "A", "B"],
    sampleDurations: [2, 3, 5],
    valid: [true, false, true],
    selectedCycle: "A",
    expectedDuration: 10,
  },
  output: { supportedDuration: 2, recordedDuration: 5, expectedShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const cycleSamplingSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/cycle-sampling-support-share",
    title: "Cycle Sampling Support Share Tool",
    description:
      "Calculate cycle sampling support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sampleDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
        selectedCycle: { type: "string", maxLength: 8192 },
        expectedDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "cycleIds",
        "sampleDurations",
        "valid",
        "selectedCycle",
        "expectedDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportedDuration: { type: "number" },
        recordedDuration: { type: "number" },
        expectedShare: { type: "number" },
      },
      required: ["supportedDuration", "recordedDuration", "expectedShare"],
    },
    ports: {
      inputs: [
        {
          id: "cycleIds",
          label: "Cycle Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sampleDurations",
          label: "Sample Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "valid",
          label: "Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedCycle",
          label: "Selected Cycle",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedDuration",
          label: "Expected Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "supportedDuration",
          label: "Supported Duration",
          valueType: { type: "number" },
        },
        {
          id: "recordedDuration",
          label: "Recorded Duration",
          valueType: { type: "number" },
        },
        {
          id: "expectedShare",
          label: "Expected Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cycleSamplingSupportShareTool.execute;
export default cycleSamplingSupportShareTool;
