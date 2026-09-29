import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalFlow: number;
  readonly estimatedBaseflow: number;
  readonly allowExcess: boolean;
};
export type Output = {
  readonly baseflowFraction: number;
  readonly quickflow: number;
  readonly physicalBalance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFlow: { type: "number", exclusiveMinimum: 0 },
    estimatedBaseflow: { type: "number" },
    allowExcess: { type: "boolean" },
  },
  required: ["totalFlow", "estimatedBaseflow", "allowExcess"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseflowFraction: { type: "number" },
    quickflow: { type: "number" },
    physicalBalance: { type: "boolean" },
  },
  required: ["baseflowFraction", "quickflow", "physicalBalance"],
} as const;
/** One observed-flow partition from an explicitly supplied baseflow estimate; no separation filter is applied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalFlow, estimatedBaseflow, allowExcess } = request;
  const compute = (): Output => {
    H.positive(totalFlow);
    H.domain(
      estimatedBaseflow >= 0 && (allowExcess || estimatedBaseflow <= totalFlow),
    );
    return {
      baseflowFraction: estimatedBaseflow / totalFlow,
      quickflow: totalFlow - estimatedBaseflow,
      physicalBalance: estimatedBaseflow <= totalFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalFlow: 10, estimatedBaseflow: 3, allowExcess: false },
  output: { baseflowFraction: 0.3, quickflow: 7, physicalBalance: true },
} satisfies ToolExample<Input, Output>;
export const baseFlowTimePointFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/base-flow-time-point-fraction",
    title: "Base Flow Time Point Fraction Tool",
    description:
      "One observed-flow partition from an explicitly supplied baseflow estimate; no separation filter is applied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFlow: { type: "number", exclusiveMinimum: 0 },
        estimatedBaseflow: { type: "number" },
        allowExcess: { type: "boolean" },
      },
      required: ["totalFlow", "estimatedBaseflow", "allowExcess"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseflowFraction: { type: "number" },
        quickflow: { type: "number" },
        physicalBalance: { type: "boolean" },
      },
      required: ["baseflowFraction", "quickflow", "physicalBalance"],
    },
    ports: {
      inputs: [
        {
          id: "totalFlow",
          label: "Total Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "estimatedBaseflow",
          label: "Estimated Baseflow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowExcess",
          label: "Allow Excess",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "baseflowFraction",
          label: "Baseflow Fraction",
          valueType: { type: "number" },
        },
        { id: "quickflow", label: "Quickflow", valueType: { type: "number" } },
        {
          id: "physicalBalance",
          label: "Physical Balance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = baseFlowTimePointFractionTool.execute;
export default baseFlowTimePointFractionTool;
