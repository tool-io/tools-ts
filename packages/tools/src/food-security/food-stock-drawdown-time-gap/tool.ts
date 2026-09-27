import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly usableStock: number;
  readonly drawPerTime: number;
  readonly requiredDuration: number;
};
export type Output = { readonly duration: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableStock: { type: "number", minimum: 0 },
    drawPerTime: { type: "number", exclusiveMinimum: 0 },
    requiredDuration: { type: "number", minimum: 0 },
  },
  required: ["usableStock", "drawPerTime", "requiredDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { duration: { type: "number" }, gap: { type: "number" } },
  required: ["duration", "gap"],
} as const;
/** Compare explicit constant-draw stock coverage to a supplied duration without predicting household need. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { usableStock, drawPerTime, requiredDuration } = request;
  const compute = (): Output => {
    H.domain(usableStock >= 0 && requiredDuration >= 0);
    H.positive(drawPerTime);
    return {
      duration: usableStock / drawPerTime,
      gap: usableStock / drawPerTime - requiredDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { usableStock: 100, drawPerTime: 10, requiredDuration: 8 },
  output: { duration: 10, gap: 2 },
} satisfies ToolExample<Input, Output>;
export const foodStockDrawdownTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/food-stock-drawdown-time-gap",
    title: "Food Stock Drawdown Time Gap Tool",
    description:
      "Compare explicit constant-draw stock coverage to a supplied duration without predicting household need.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableStock: { type: "number", minimum: 0 },
        drawPerTime: { type: "number", exclusiveMinimum: 0 },
        requiredDuration: { type: "number", minimum: 0 },
      },
      required: ["usableStock", "drawPerTime", "requiredDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { duration: { type: "number" }, gap: { type: "number" } },
      required: ["duration", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "usableStock",
          label: "Usable Stock",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drawPerTime",
          label: "Draw Per Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredDuration",
          label: "Required Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "duration", label: "Duration", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = foodStockDrawdownTimeGapTool.execute;
export default foodStockDrawdownTimeGapTool;
