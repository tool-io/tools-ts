import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedTime: number;
  readonly plannedTime: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedTime: { type: "number", minimum: 0 },
    plannedTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedTime", "plannedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate study followup exposure share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedTime, plannedTime } = request;
  const compute = (): Output => {
    H.domain(observedTime >= 0);
    H.positive(plannedTime);
    return { share: observedTime / plannedTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedTime: 15, plannedTime: 20 },
  output: { share: 0.75 },
} satisfies ToolExample<Input, Output>;
export const studyFollowupExposureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chiropractic/study-followup-exposure-share",
    title: "Study Followup Exposure Share Tool",
    description:
      "Calculate study followup exposure share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedTime: { type: "number", minimum: 0 },
        plannedTime: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedTime", "plannedTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "observedTime",
          label: "Observed Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plannedTime",
          label: "Planned Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = studyFollowupExposureShareTool.execute;
export default studyFollowupExposureShareTool;
