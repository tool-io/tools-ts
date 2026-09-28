import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly primaryMinutes: number;
  readonly secondaryMinutes: number;
  readonly simultaneousMinutes: number;
  readonly observedMinutes: number;
};
export type Output = {
  readonly uniqueActivityMinutes: number;
  readonly simultaneousFraction: number;
  readonly unallocatedMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    primaryMinutes: { type: "number", minimum: 0 },
    secondaryMinutes: { type: "number", minimum: 0 },
    simultaneousMinutes: { type: "number", minimum: 0 },
    observedMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "primaryMinutes",
    "secondaryMinutes",
    "simultaneousMinutes",
    "observedMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueActivityMinutes: { type: "number" },
    simultaneousFraction: { type: "number" },
    unallocatedMinutes: { type: "number" },
  },
  required: [
    "uniqueActivityMinutes",
    "simultaneousFraction",
    "unallocatedMinutes",
  ],
} as const;
/** Calculate older adult diary simultaneous activity share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    primaryMinutes,
    secondaryMinutes,
    simultaneousMinutes,
    observedMinutes,
  } = request;
  const compute = (): Output => {
    H.positive(observedMinutes);
    H.domain(
      primaryMinutes >= 0 &&
        secondaryMinutes >= 0 &&
        simultaneousMinutes >= 0 &&
        simultaneousMinutes <= Math.min(primaryMinutes, secondaryMinutes) &&
        primaryMinutes + secondaryMinutes - simultaneousMinutes <=
          observedMinutes,
    );
    return {
      uniqueActivityMinutes:
        primaryMinutes + secondaryMinutes - simultaneousMinutes,
      simultaneousFraction: simultaneousMinutes / observedMinutes,
      unallocatedMinutes:
        observedMinutes -
        primaryMinutes -
        secondaryMinutes +
        simultaneousMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    primaryMinutes: 120,
    secondaryMinutes: 60,
    simultaneousMinutes: 30,
    observedMinutes: 240,
  },
  output: {
    uniqueActivityMinutes: 150,
    simultaneousFraction: 0.125,
    unallocatedMinutes: 90,
  },
} satisfies ToolExample<Input, Output>;
export const olderAdultDiarySimultaneousActivityShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gerontology/older-adult-diary-simultaneous-activity-share",
      title: "Older Adult Diary Simultaneous Activity Share Tool",
      description:
        "Calculate older adult diary simultaneous activity share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          primaryMinutes: { type: "number", minimum: 0 },
          secondaryMinutes: { type: "number", minimum: 0 },
          simultaneousMinutes: { type: "number", minimum: 0 },
          observedMinutes: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "primaryMinutes",
          "secondaryMinutes",
          "simultaneousMinutes",
          "observedMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uniqueActivityMinutes: { type: "number" },
          simultaneousFraction: { type: "number" },
          unallocatedMinutes: { type: "number" },
        },
        required: [
          "uniqueActivityMinutes",
          "simultaneousFraction",
          "unallocatedMinutes",
        ],
      },
      ports: {
        inputs: [
          {
            id: "primaryMinutes",
            label: "Primary Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "secondaryMinutes",
            label: "Secondary Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "simultaneousMinutes",
            label: "Simultaneous Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "observedMinutes",
            label: "Observed Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
        ],
        outputs: [
          {
            id: "uniqueActivityMinutes",
            label: "Unique Activity Minutes",
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "simultaneousFraction",
            label: "Simultaneous Fraction",
            valueType: { type: "number" },
          },
          {
            id: "unallocatedMinutes",
            label: "Unallocated Minutes",
            valueType: { type: "number", unit: "min" },
          },
        ],
      },
    },
    calculate,
  });
export const run = olderAdultDiarySimultaneousActivityShareTool.execute;
export default olderAdultDiarySimultaneousActivityShareTool;
