import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeReset: number;
  readonly resetValue: number;
  readonly afterReset: number;
  readonly finalValue: number;
};
export type Output = {
  readonly preResetIncrement: number;
  readonly postResetIncrement: number;
  readonly totalIncrement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeReset: { type: "number" },
    resetValue: { type: "number" },
    afterReset: { type: "number" },
    finalValue: { type: "number" },
  },
  required: ["beforeReset", "resetValue", "afterReset", "finalValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preResetIncrement: { type: "number" },
    postResetIncrement: { type: "number" },
    totalIncrement: { type: "number" },
  },
  required: ["preResetIncrement", "postResetIncrement", "totalIncrement"],
} as const;
/** Accumulate supplied monotone flowmeter segments around one explicit reset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeReset, resetValue, afterReset, finalValue } = request;
  const compute = (): Output => {
    H.domain(resetValue >= beforeReset && finalValue >= afterReset);
    return {
      preResetIncrement: resetValue - beforeReset,
      postResetIncrement: finalValue - afterReset,
      totalIncrement: resetValue - beforeReset + finalValue - afterReset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeReset: 90, resetValue: 100, afterReset: 0, finalValue: 25 },
  output: { preResetIncrement: 10, postResetIncrement: 25, totalIncrement: 35 },
} satisfies ToolExample<Input, Output>;
export const flowmeterResetCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/flowmeter-reset-credit",
    title: "Flowmeter Reset Credit Tool",
    description:
      "Accumulate supplied monotone flowmeter segments around one explicit reset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeReset: { type: "number" },
        resetValue: { type: "number" },
        afterReset: { type: "number" },
        finalValue: { type: "number" },
      },
      required: ["beforeReset", "resetValue", "afterReset", "finalValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preResetIncrement: { type: "number" },
        postResetIncrement: { type: "number" },
        totalIncrement: { type: "number" },
      },
      required: ["preResetIncrement", "postResetIncrement", "totalIncrement"],
    },
    ports: {
      inputs: [
        {
          id: "beforeReset",
          label: "Before Reset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resetValue",
          label: "Reset Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterReset",
          label: "After Reset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalValue",
          label: "Final Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "preResetIncrement",
          label: "Pre Reset Increment",
          valueType: { type: "number" },
        },
        {
          id: "postResetIncrement",
          label: "Post Reset Increment",
          valueType: { type: "number" },
        },
        {
          id: "totalIncrement",
          label: "Total Increment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = flowmeterResetCreditTool.execute;
export default flowmeterResetCreditTool;
