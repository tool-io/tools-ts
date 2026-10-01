import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workMinutes: number;
  readonly restMinutes: number;
  readonly cycles: number;
  readonly transitionMinutes: number;
  readonly shiftMinutes: number;
};
export type Output = {
  readonly scheduledMinutes: number;
  readonly workShare: number;
  readonly unallocatedMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workMinutes: { type: "number", minimum: 0 },
    restMinutes: { type: "number", minimum: 0 },
    cycles: { type: "integer", minimum: 0 },
    transitionMinutes: { type: "number", minimum: 0 },
    shiftMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "workMinutes",
    "restMinutes",
    "cycles",
    "transitionMinutes",
    "shiftMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledMinutes: { type: "number" },
    workShare: { type: "number" },
    unallocatedMinutes: { type: "number" },
  },
  required: ["scheduledMinutes", "workShare", "unallocatedMinutes"],
} as const;
/** Audit explicit study work/rest timing without choosing a heat-exposure schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workMinutes, restMinutes, cycles, transitionMinutes, shiftMinutes } =
    request;
  const compute = (): Output => {
    H.domain(workMinutes >= 0 && restMinutes >= 0 && transitionMinutes >= 0);
    H.integer(cycles, 0);
    H.positive(shiftMinutes);
    return {
      scheduledMinutes:
        cycles * (workMinutes + restMinutes) +
        Math.max(0, cycles - 1) * transitionMinutes,
      workShare: (cycles * workMinutes) / shiftMinutes,
      unallocatedMinutes:
        shiftMinutes -
        cycles * (workMinutes + restMinutes) -
        Math.max(0, cycles - 1) * transitionMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    workMinutes: 40,
    restMinutes: 20,
    cycles: 3,
    transitionMinutes: 5,
    shiftMinutes: 240,
  },
  output: { scheduledMinutes: 190, workShare: 0.5, unallocatedMinutes: 50 },
} satisfies ToolExample<Input, Output>;
export const heatStudyWorkRestTimeBudgetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/heat-study-work-rest-time-budget-term",
    title: "Heat Study Work Rest Time Budget Term Tool",
    description:
      "Audit explicit study work/rest timing without choosing a heat-exposure schedule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workMinutes: { type: "number", minimum: 0 },
        restMinutes: { type: "number", minimum: 0 },
        cycles: { type: "integer", minimum: 0 },
        transitionMinutes: { type: "number", minimum: 0 },
        shiftMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "workMinutes",
        "restMinutes",
        "cycles",
        "transitionMinutes",
        "shiftMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledMinutes: { type: "number" },
        workShare: { type: "number" },
        unallocatedMinutes: { type: "number" },
      },
      required: ["scheduledMinutes", "workShare", "unallocatedMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "workMinutes",
          label: "Work Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "restMinutes",
          label: "Rest Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycles",
          label: "Cycles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "transitionMinutes",
          label: "Transition Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shiftMinutes",
          label: "Shift Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scheduledMinutes",
          label: "Scheduled Minutes",
          valueType: { type: "number" },
        },
        { id: "workShare", label: "Work Share", valueType: { type: "number" } },
        {
          id: "unallocatedMinutes",
          label: "Unallocated Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = heatStudyWorkRestTimeBudgetTermTool.execute;
export default heatStudyWorkRestTimeBudgetTermTool;
