import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly repeatMeanMs: number;
  readonly switchMeanMs: number;
  readonly repeatErrors: number;
  readonly repeatTrials: number;
  readonly switchErrors: number;
  readonly switchTrials: number;
};
export type Output = {
  readonly latencySwitchCostMs: number;
  readonly errorSwitchCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repeatMeanMs: { type: "number", minimum: 0 },
    switchMeanMs: { type: "number", minimum: 0 },
    repeatErrors: { type: "integer", minimum: 0 },
    repeatTrials: { type: "integer", minimum: 1 },
    switchErrors: { type: "integer", minimum: 0 },
    switchTrials: { type: "integer", minimum: 1 },
  },
  required: [
    "repeatMeanMs",
    "switchMeanMs",
    "repeatErrors",
    "repeatTrials",
    "switchErrors",
    "switchTrials",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latencySwitchCostMs: { type: "number" },
    errorSwitchCost: { type: "number" },
  },
  required: ["latencySwitchCostMs", "errorSwitchCost"],
} as const;
/** Calculate child executive task rule switch gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    repeatMeanMs,
    switchMeanMs,
    repeatErrors,
    repeatTrials,
    switchErrors,
    switchTrials,
  } = request;
  const compute = (): Output => {
    H.domain(repeatMeanMs >= 0 && switchMeanMs >= 0);
    H.integer(repeatTrials, 1);
    H.integer(switchTrials, 1);
    H.integer(repeatErrors, 0, repeatTrials);
    H.integer(switchErrors, 0, switchTrials);
    return {
      latencySwitchCostMs: switchMeanMs - repeatMeanMs,
      errorSwitchCost:
        switchErrors / switchTrials - repeatErrors / repeatTrials,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    repeatMeanMs: 500,
    switchMeanMs: 600,
    repeatErrors: 2,
    repeatTrials: 20,
    switchErrors: 5,
    switchTrials: 20,
  },
  output: { latencySwitchCostMs: 100, errorSwitchCost: 0.15 },
} satisfies ToolExample<Input, Output>;
export const childExecutiveTaskRuleSwitchGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/child-executive-task-rule-switch-gap",
    title: "Child Executive Task Rule Switch Gap Tool",
    description:
      "Calculate child executive task rule switch gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        repeatMeanMs: { type: "number", minimum: 0 },
        switchMeanMs: { type: "number", minimum: 0 },
        repeatErrors: { type: "integer", minimum: 0 },
        repeatTrials: { type: "integer", minimum: 1 },
        switchErrors: { type: "integer", minimum: 0 },
        switchTrials: { type: "integer", minimum: 1 },
      },
      required: [
        "repeatMeanMs",
        "switchMeanMs",
        "repeatErrors",
        "repeatTrials",
        "switchErrors",
        "switchTrials",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latencySwitchCostMs: { type: "number" },
        errorSwitchCost: { type: "number" },
      },
      required: ["latencySwitchCostMs", "errorSwitchCost"],
    },
    ports: {
      inputs: [
        {
          id: "repeatMeanMs",
          label: "Repeat Mean Ms",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "switchMeanMs",
          label: "Switch Mean Ms",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "repeatErrors",
          label: "Repeat Errors",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "repeatTrials",
          label: "Repeat Trials",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "switchErrors",
          label: "Switch Errors",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "switchTrials",
          label: "Switch Trials",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "latencySwitchCostMs",
          label: "Latency Switch Cost Ms",
          valueType: { type: "number" },
        },
        {
          id: "errorSwitchCost",
          label: "Error Switch Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = childExecutiveTaskRuleSwitchGapTool.execute;
export default childExecutiveTaskRuleSwitchGapTool;
