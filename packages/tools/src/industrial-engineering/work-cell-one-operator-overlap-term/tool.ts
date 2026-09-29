import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly manualMinutes: number;
  readonly automaticMinutes: number;
  readonly walkMinutes: number;
  readonly otherManualDuringAutomatic: number;
};
export type Output = {
  readonly laborMinutes: number;
  readonly overlappedMinutes: number;
  readonly cycleMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    manualMinutes: { type: "number", minimum: 0 },
    automaticMinutes: { type: "number", minimum: 0 },
    walkMinutes: { type: "number", minimum: 0 },
    otherManualDuringAutomatic: { type: "number", minimum: 0 },
  },
  required: [
    "manualMinutes",
    "automaticMinutes",
    "walkMinutes",
    "otherManualDuringAutomatic",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    laborMinutes: { type: "number" },
    overlappedMinutes: { type: "number" },
    cycleMinutes: { type: "number" },
  },
  required: ["laborMinutes", "overlappedMinutes", "cycleMinutes"],
} as const;
/** One explicit cell timing model: main manual work and walking precede overlapping automatic and other manual blocks. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    manualMinutes,
    automaticMinutes,
    walkMinutes,
    otherManualDuringAutomatic,
  } = request;
  const compute = (): Output => {
    H.domain(
      manualMinutes >= 0 &&
        automaticMinutes >= 0 &&
        walkMinutes >= 0 &&
        otherManualDuringAutomatic >= 0,
    );
    return {
      laborMinutes: manualMinutes + walkMinutes + otherManualDuringAutomatic,
      overlappedMinutes: Math.min(automaticMinutes, otherManualDuringAutomatic),
      cycleMinutes:
        manualMinutes +
        walkMinutes +
        Math.max(automaticMinutes, otherManualDuringAutomatic),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    manualMinutes: 2,
    automaticMinutes: 5,
    walkMinutes: 1,
    otherManualDuringAutomatic: 3,
  },
  output: { laborMinutes: 6, overlappedMinutes: 3, cycleMinutes: 8 },
} satisfies ToolExample<Input, Output>;
export const workCellOneOperatorOverlapTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/work-cell-one-operator-overlap-term",
    title: "Work Cell One Operator Overlap Term Tool",
    description:
      "One explicit cell timing model: main manual work and walking precede overlapping automatic and other manual blocks.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        manualMinutes: { type: "number", minimum: 0 },
        automaticMinutes: { type: "number", minimum: 0 },
        walkMinutes: { type: "number", minimum: 0 },
        otherManualDuringAutomatic: { type: "number", minimum: 0 },
      },
      required: [
        "manualMinutes",
        "automaticMinutes",
        "walkMinutes",
        "otherManualDuringAutomatic",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        laborMinutes: { type: "number" },
        overlappedMinutes: { type: "number" },
        cycleMinutes: { type: "number" },
      },
      required: ["laborMinutes", "overlappedMinutes", "cycleMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "manualMinutes",
          label: "Manual Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "automaticMinutes",
          label: "Automatic Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "walkMinutes",
          label: "Walk Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "otherManualDuringAutomatic",
          label: "Other Manual During Automatic",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "laborMinutes",
          label: "Labor Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "overlappedMinutes",
          label: "Overlapped Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "cycleMinutes",
          label: "Cycle Minutes",
          valueType: { type: "number", unit: "min" },
        },
      ],
    },
  },
  calculate,
});
export const run = workCellOneOperatorOverlapTermTool.execute;
export default workCellOneOperatorOverlapTermTool;
