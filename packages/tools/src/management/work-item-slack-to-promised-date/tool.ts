import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly promisedAt: number;
  readonly forecastFinish: number;
};
export type Output = { readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    promisedAt: { type: "number" },
    forecastFinish: { type: "number" },
  },
  required: ["promisedAt", "forecastFinish"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slack: { type: "number" } },
  required: ["slack"],
} as const;
/** Calculate work item slack to promised date from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { promisedAt, forecastFinish } = request;
  const compute = (): Output => {
    return { slack: promisedAt - forecastFinish };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { promisedAt: 20, forecastFinish: 17 },
  output: { slack: 3 },
} satisfies ToolExample<Input, Output>;
export const workItemSlackToPromisedDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/work-item-slack-to-promised-date",
    title: "Work Item Slack To Promised Date Tool",
    description:
      "Calculate work item slack to promised date from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        promisedAt: { type: "number" },
        forecastFinish: { type: "number" },
      },
      required: ["promisedAt", "forecastFinish"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slack: { type: "number" } },
      required: ["slack"],
    },
    ports: {
      inputs: [
        {
          id: "promisedAt",
          label: "Promised At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forecastFinish",
          label: "Forecast Finish",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "slack", label: "Slack", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = workItemSlackToPromisedDateTool.execute;
export default workItemSlackToPromisedDateTool;
