import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reflectionMinutes: number;
  readonly actionMinutes: number;
  readonly planningMinutes: number;
};
export type Output = {
  readonly reflectionActionRatio: number;
  readonly reflectionShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reflectionMinutes: { type: "number", minimum: 0 },
    actionMinutes: { type: "number", exclusiveMinimum: 0 },
    planningMinutes: { type: "number", minimum: 0 },
  },
  required: ["reflectionMinutes", "actionMinutes", "planningMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reflectionActionRatio: { type: "number" },
    reflectionShare: { type: "number" },
  },
  required: ["reflectionActionRatio", "reflectionShare"],
} as const;
/** Calculate experiential reflection action time ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reflectionMinutes, actionMinutes, planningMinutes } = request;
  const compute = (): Output => {
    H.domain(reflectionMinutes >= 0 && planningMinutes >= 0);
    H.positive(actionMinutes);
    return {
      reflectionActionRatio: reflectionMinutes / actionMinutes,
      reflectionShare:
        reflectionMinutes /
        (reflectionMinutes + actionMinutes + planningMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reflectionMinutes: 20, actionMinutes: 40, planningMinutes: 20 },
  output: { reflectionActionRatio: 0.5, reflectionShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const experientialReflectionActionTimeRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "andragogy/experiential-reflection-action-time-ratio",
      title: "Experiential Reflection Action Time Ratio Tool",
      description:
        "Calculate experiential reflection action time ratio from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reflectionMinutes: { type: "number", minimum: 0 },
          actionMinutes: { type: "number", exclusiveMinimum: 0 },
          planningMinutes: { type: "number", minimum: 0 },
        },
        required: ["reflectionMinutes", "actionMinutes", "planningMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reflectionActionRatio: { type: "number" },
          reflectionShare: { type: "number" },
        },
        required: ["reflectionActionRatio", "reflectionShare"],
      },
      ports: {
        inputs: [
          {
            id: "reflectionMinutes",
            label: "Reflection Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "actionMinutes",
            label: "Action Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "planningMinutes",
            label: "Planning Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
        ],
        outputs: [
          {
            id: "reflectionActionRatio",
            label: "Reflection Action Ratio",
            valueType: { type: "number" },
          },
          {
            id: "reflectionShare",
            label: "Reflection Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = experientialReflectionActionTimeRatioTool.execute;
export default experientialReflectionActionTimeRatioTool;
