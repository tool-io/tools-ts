import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetCompositeVolume: number;
  readonly intervalFlowWeight: number;
  readonly totalFlowWeight: number;
};
export type Output = { readonly aliquotVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetCompositeVolume: { type: "number", minimum: 0 },
    intervalFlowWeight: { type: "number", minimum: 0 },
    totalFlowWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["targetCompositeVolume", "intervalFlowWeight", "totalFlowWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { aliquotVolume: { type: "number" } },
  required: ["aliquotVolume"],
} as const;
/** Allocate one explicit composite sample aliquot in proportion to a supplied interval flow weight without choosing sampling times. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetCompositeVolume, intervalFlowWeight, totalFlowWeight } =
    request;
  const compute = (): Output => {
    H.domain(targetCompositeVolume >= 0, "targetCompositeVolume");
    (H.domain(
      Number.isFinite(totalFlowWeight) && totalFlowWeight > 0,
      "totalFlowWeight",
    ),
      totalFlowWeight);
    H.domain(
      intervalFlowWeight >= 0 && intervalFlowWeight <= totalFlowWeight,
      "intervalFlowWeight",
    );
    return {
      aliquotVolume:
        targetCompositeVolume * (intervalFlowWeight / totalFlowWeight),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    targetCompositeVolume: 1000,
    intervalFlowWeight: 30,
    totalFlowWeight: 120,
  },
  output: { aliquotVolume: 250 },
} satisfies ToolExample<Input, Output>;
export const compositeSampleFlowProportionalAliquotTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/composite-sample-flow-proportional-aliquot",
      title: "Composite Sample Flow Proportional Aliquot Tool",
      description:
        "Allocate one explicit composite sample aliquot in proportion to a supplied interval flow weight without choosing sampling times.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          targetCompositeVolume: { type: "number", minimum: 0 },
          intervalFlowWeight: { type: "number", minimum: 0 },
          totalFlowWeight: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "targetCompositeVolume",
          "intervalFlowWeight",
          "totalFlowWeight",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { aliquotVolume: { type: "number" } },
        required: ["aliquotVolume"],
      },
      ports: {
        inputs: [
          {
            id: "targetCompositeVolume",
            label: "Target Composite Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "intervalFlowWeight",
            label: "Interval Flow Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalFlowWeight",
            label: "Total Flow Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "aliquotVolume",
            label: "Aliquot Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = compositeSampleFlowProportionalAliquotTool.execute;
export default compositeSampleFlowProportionalAliquotTool;
