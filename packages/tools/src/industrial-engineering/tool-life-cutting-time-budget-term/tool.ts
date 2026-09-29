import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lifeMinutes: number;
  readonly usedMinutes: number;
  readonly cutMinutesPerPart: number;
  readonly plannedParts: number;
};
export type Output = {
  readonly remainingMinutes: number;
  readonly wholeParts: number;
  readonly plannedSlackMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lifeMinutes: { type: "number", minimum: 0 },
    usedMinutes: { type: "number", minimum: 0 },
    cutMinutesPerPart: { type: "number", exclusiveMinimum: 0 },
    plannedParts: { type: "integer", minimum: 0 },
  },
  required: ["lifeMinutes", "usedMinutes", "cutMinutesPerPart", "plannedParts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingMinutes: { type: "number" },
    wholeParts: { type: "integer" },
    plannedSlackMinutes: { type: "number" },
  },
  required: ["remainingMinutes", "wholeParts", "plannedSlackMinutes"],
} as const;
/** Supplied cutting-time life budget; no tool material, failure distribution or cutting-speed life model is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lifeMinutes, usedMinutes, cutMinutesPerPart, plannedParts } = request;
  const compute = (): Output => {
    H.domain(
      lifeMinutes >= 0 && usedMinutes >= 0 && usedMinutes <= lifeMinutes,
    );
    H.positive(cutMinutesPerPart);
    H.integer(plannedParts, 0);
    return {
      remainingMinutes: lifeMinutes - usedMinutes,
      wholeParts: Math.floor((lifeMinutes - usedMinutes) / cutMinutesPerPart),
      plannedSlackMinutes:
        lifeMinutes - usedMinutes - plannedParts * cutMinutesPerPart,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lifeMinutes: 100,
    usedMinutes: 30,
    cutMinutesPerPart: 4,
    plannedParts: 20,
  },
  output: { remainingMinutes: 70, wholeParts: 17, plannedSlackMinutes: -10 },
} satisfies ToolExample<Input, Output>;
export const toolLifeCuttingTimeBudgetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/tool-life-cutting-time-budget-term",
    title: "Tool Life Cutting Time Budget Term Tool",
    description:
      "Supplied cutting-time life budget; no tool material, failure distribution or cutting-speed life model is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lifeMinutes: { type: "number", minimum: 0 },
        usedMinutes: { type: "number", minimum: 0 },
        cutMinutesPerPart: { type: "number", exclusiveMinimum: 0 },
        plannedParts: { type: "integer", minimum: 0 },
      },
      required: [
        "lifeMinutes",
        "usedMinutes",
        "cutMinutesPerPart",
        "plannedParts",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingMinutes: { type: "number" },
        wholeParts: { type: "integer" },
        plannedSlackMinutes: { type: "number" },
      },
      required: ["remainingMinutes", "wholeParts", "plannedSlackMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "lifeMinutes",
          label: "Life Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "usedMinutes",
          label: "Used Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "cutMinutesPerPart",
          label: "Cut Minutes Per Part",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plannedParts",
          label: "Planned Parts",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingMinutes",
          label: "Remaining Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "wholeParts",
          label: "Whole Parts",
          valueType: { type: "integer" },
        },
        {
          id: "plannedSlackMinutes",
          label: "Planned Slack Minutes",
          valueType: { type: "number", unit: "min" },
        },
      ],
    },
  },
  calculate,
});
export const run = toolLifeCuttingTimeBudgetTermTool.execute;
export default toolLifeCuttingTimeBudgetTermTool;
