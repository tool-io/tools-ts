import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableTravel: number;
  readonly engagementTravel: number;
  readonly allowance: number;
};
export type Output = { readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableTravel: { type: "number", minimum: 0 },
    engagementTravel: { type: "number", minimum: 0 },
    allowance: { type: "number", minimum: 0 },
  },
  required: ["availableTravel", "engagementTravel", "allowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { margin: { type: "number" } },
  required: ["margin"],
} as const;
/** Calculate latch overtravel engagement margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableTravel, engagementTravel, allowance } = request;
  const compute = (): Output => {
    H.domain(availableTravel >= 0 && engagementTravel >= 0 && allowance >= 0);
    return { margin: availableTravel - engagementTravel - allowance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableTravel: 12, engagementTravel: 8, allowance: 2 },
  output: { margin: 2 },
} satisfies ToolExample<Input, Output>;
export const latchOvertravelEngagementMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/latch-overtravel-engagement-margin",
    title: "Latch Overtravel Engagement Margin Tool",
    description:
      "Calculate latch overtravel engagement margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableTravel: { type: "number", minimum: 0 },
        engagementTravel: { type: "number", minimum: 0 },
        allowance: { type: "number", minimum: 0 },
      },
      required: ["availableTravel", "engagementTravel", "allowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { margin: { type: "number" } },
      required: ["margin"],
    },
    ports: {
      inputs: [
        {
          id: "availableTravel",
          label: "Available Travel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "engagementTravel",
          label: "Engagement Travel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowance",
          label: "Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = latchOvertravelEngagementMarginTool.execute;
export default latchOvertravelEngagementMarginTool;
