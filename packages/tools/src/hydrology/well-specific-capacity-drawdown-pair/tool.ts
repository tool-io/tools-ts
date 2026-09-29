import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly pumpingRate: number; readonly drawdown: number };
export type Output = {
  readonly specificCapacity: number;
  readonly drawdownPerRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pumpingRate: { type: "number", exclusiveMinimum: 0 },
    drawdown: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pumpingRate", "drawdown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specificCapacity: { type: "number" },
    drawdownPerRate: { type: "number" },
  },
  required: ["specificCapacity", "drawdownPerRate"],
} as const;
/** Calculate well specific capacity drawdown pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pumpingRate, drawdown } = request;
  const compute = (): Output => {
    H.positive(pumpingRate);
    H.positive(drawdown);
    return {
      specificCapacity: pumpingRate / drawdown,
      drawdownPerRate: drawdown / pumpingRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pumpingRate: 20, drawdown: 4 },
  output: { specificCapacity: 5, drawdownPerRate: 0.2 },
} satisfies ToolExample<Input, Output>;
export const wellSpecificCapacityDrawdownPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/well-specific-capacity-drawdown-pair",
    title: "Well Specific Capacity Drawdown Pair Tool",
    description:
      "Calculate well specific capacity drawdown pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pumpingRate: { type: "number", exclusiveMinimum: 0 },
        drawdown: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pumpingRate", "drawdown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specificCapacity: { type: "number" },
        drawdownPerRate: { type: "number" },
      },
      required: ["specificCapacity", "drawdownPerRate"],
    },
    ports: {
      inputs: [
        {
          id: "pumpingRate",
          label: "Pumping Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drawdown",
          label: "Drawdown",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "specificCapacity",
          label: "Specific Capacity",
          valueType: { type: "number" },
        },
        {
          id: "drawdownPerRate",
          label: "Drawdown Per Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wellSpecificCapacityDrawdownPairTool.execute;
export default wellSpecificCapacityDrawdownPairTool;
