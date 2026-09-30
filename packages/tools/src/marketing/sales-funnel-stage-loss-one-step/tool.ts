import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entered: number;
  readonly advanced: number;
  readonly cost: number;
};
export type Output = {
  readonly lost: number;
  readonly lossFraction: number;
  readonly costPerAdvance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entered: { type: "integer", minimum: 1 },
    advanced: { type: "integer", minimum: 1 },
    cost: { type: "number", minimum: 0 },
  },
  required: ["entered", "advanced", "cost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lost: { type: "integer" },
    lossFraction: { type: "number" },
    costPerAdvance: { type: "number" },
  },
  required: ["lost", "lossFraction", "costPerAdvance"],
} as const;
/** Calculate sales funnel stage loss one step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entered, advanced, cost } = request;
  const compute = (): Output => {
    H.integer(entered, 1);
    H.integer(advanced, 1, entered);
    H.domain(cost >= 0);
    return {
      lost: entered - advanced,
      lossFraction: (entered - advanced) / entered,
      costPerAdvance: cost / advanced,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entered: 100, advanced: 40, cost: 200 },
  output: { lost: 60, lossFraction: 0.6, costPerAdvance: 5 },
} satisfies ToolExample<Input, Output>;
export const salesFunnelStageLossOneStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/sales-funnel-stage-loss-one-step",
    title: "Sales Funnel Stage Loss One Step Tool",
    description:
      "Calculate sales funnel stage loss one step from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entered: { type: "integer", minimum: 1 },
        advanced: { type: "integer", minimum: 1 },
        cost: { type: "number", minimum: 0 },
      },
      required: ["entered", "advanced", "cost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lost: { type: "integer" },
        lossFraction: { type: "number" },
        costPerAdvance: { type: "number" },
      },
      required: ["lost", "lossFraction", "costPerAdvance"],
    },
    ports: {
      inputs: [
        {
          id: "entered",
          label: "Entered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "advanced",
          label: "Advanced",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cost",
          label: "Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lost", label: "Lost", valueType: { type: "integer" } },
        {
          id: "lossFraction",
          label: "Loss Fraction",
          valueType: { type: "number" },
        },
        {
          id: "costPerAdvance",
          label: "Cost Per Advance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = salesFunnelStageLossOneStepTool.execute;
export default salesFunnelStageLossOneStepTool;
