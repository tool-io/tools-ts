import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startQuantity: number;
  readonly endQuantity: number;
  readonly startMarginalCost: number;
  readonly endMarginalCost: number;
};
export type Output = {
  readonly incrementalQuantity: number;
  readonly segmentCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startQuantity: { type: "number" },
    endQuantity: { type: "number" },
    startMarginalCost: { type: "number" },
    endMarginalCost: { type: "number" },
  },
  required: [
    "startQuantity",
    "endQuantity",
    "startMarginalCost",
    "endMarginalCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incrementalQuantity: { type: "number" },
    segmentCost: { type: "number" },
  },
  required: ["incrementalQuantity", "segmentCost"],
} as const;
/** Integrate one caller-supplied linear marginal abatement-cost segment by the trapezoid rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startQuantity, endQuantity, startMarginalCost, endMarginalCost } =
    request;
  const compute = (): Output => {
    H.domain(endQuantity >= startQuantity);
    return {
      incrementalQuantity: endQuantity - startQuantity,
      segmentCost:
        ((endQuantity - startQuantity) *
          (startMarginalCost + endMarginalCost)) /
        2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startQuantity: 10,
    endQuantity: 30,
    startMarginalCost: 2,
    endMarginalCost: 4,
  },
  output: { incrementalQuantity: 20, segmentCost: 60 },
} satisfies ToolExample<Input, Output>;
export const abatementCostCurveSegmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/abatement-cost-curve-segment",
    title: "Abatement Cost Curve Segment Tool",
    description:
      "Integrate one caller-supplied linear marginal abatement-cost segment by the trapezoid rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startQuantity: { type: "number" },
        endQuantity: { type: "number" },
        startMarginalCost: { type: "number" },
        endMarginalCost: { type: "number" },
      },
      required: [
        "startQuantity",
        "endQuantity",
        "startMarginalCost",
        "endMarginalCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incrementalQuantity: { type: "number" },
        segmentCost: { type: "number" },
      },
      required: ["incrementalQuantity", "segmentCost"],
    },
    ports: {
      inputs: [
        {
          id: "startQuantity",
          label: "Start Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endQuantity",
          label: "End Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startMarginalCost",
          label: "Start Marginal Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endMarginalCost",
          label: "End Marginal Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "incrementalQuantity",
          label: "Incremental Quantity",
          valueType: { type: "number" },
        },
        {
          id: "segmentCost",
          label: "Segment Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = abatementCostCurveSegmentTool.execute;
export default abatementCostCurveSegmentTool;
