import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedTaskIds: readonly string[];
  readonly observedTaskIds: readonly string[];
  readonly cancelledTaskIds: readonly string[];
};
export type Output = {
  readonly eligibleTasks: number;
  readonly observedTasks: number;
  readonly missedTasks: number;
  readonly extraObservedTasks: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedTaskIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observedTaskIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    cancelledTaskIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["plannedTaskIds", "observedTaskIds", "cancelledTaskIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleTasks: { type: "integer" },
    observedTasks: { type: "integer" },
    missedTasks: { type: "integer" },
    extraObservedTasks: { type: "integer" },
  },
  required: [
    "eligibleTasks",
    "observedTasks",
    "missedTasks",
    "extraObservedTasks",
  ],
} as const;
/** Compare explicit research task inventories, retaining extra observations rather than assuming care adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedTaskIds, observedTaskIds, cancelledTaskIds } = request;
  const compute = (): Output => {
    return (() => {
      const planned = [...new Set(plannedTaskIds)].filter(
          (x) => !cancelledTaskIds.includes(x),
        ),
        observedTasks = planned.filter((x) =>
          observedTaskIds.includes(x),
        ).length;
      return {
        eligibleTasks: planned.length,
        observedTasks,
        missedTasks: planned.length - observedTasks,
        extraObservedTasks: [...new Set(observedTaskIds)].filter(
          (x) => !planned.includes(x),
        ).length,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    plannedTaskIds: ["a", "b", "c"],
    observedTaskIds: ["a", "d"],
    cancelledTaskIds: ["c"],
  },
  output: {
    eligibleTasks: 2,
    observedTasks: 1,
    missedTasks: 1,
    extraObservedTasks: 1,
  },
} satisfies ToolExample<Input, Output>;
export const researchCareTaskGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "nursing/research-care-task-gap",
      title: "Research Care Task Gap Tool",
      description:
        "Compare explicit research task inventories, retaining extra observations rather than assuming care adequacy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          plannedTaskIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          observedTaskIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          cancelledTaskIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["plannedTaskIds", "observedTaskIds", "cancelledTaskIds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleTasks: { type: "integer" },
          observedTasks: { type: "integer" },
          missedTasks: { type: "integer" },
          extraObservedTasks: { type: "integer" },
        },
        required: [
          "eligibleTasks",
          "observedTasks",
          "missedTasks",
          "extraObservedTasks",
        ],
      },
      ports: {
        inputs: [
          {
            id: "plannedTaskIds",
            label: "Planned Task Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "observedTaskIds",
            label: "Observed Task Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "cancelledTaskIds",
            label: "Cancelled Task Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "eligibleTasks",
            label: "Eligible Tasks",
            valueType: { type: "integer" },
          },
          {
            id: "observedTasks",
            label: "Observed Tasks",
            valueType: { type: "integer" },
          },
          {
            id: "missedTasks",
            label: "Missed Tasks",
            valueType: { type: "integer" },
          },
          {
            id: "extraObservedTasks",
            label: "Extra Observed Tasks",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = researchCareTaskGapTool.execute;
export default researchCareTaskGapTool;
