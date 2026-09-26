import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shiftedKwh: number;
  readonly oldPrice: number;
  readonly newPrice: number;
  readonly efficiency: number;
};
export type Output = { readonly newInputKwh: number; readonly savings: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftedKwh: { type: "number", minimum: 0 },
    oldPrice: { type: "number" },
    newPrice: { type: "number" },
    efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["shiftedKwh", "oldPrice", "newPrice", "efficiency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newInputKwh: { type: "number" }, savings: { type: "number" } },
  required: ["newInputKwh", "savings"],
} as const;
/** Cost change for equal useful energy after a caller-supplied shifting efficiency, excluding demand charges. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shiftedKwh, oldPrice, newPrice, efficiency } = request;
  const compute = (): Output => {
    H.domain(shiftedKwh >= 0 && efficiency > 0 && efficiency <= 1);
    return {
      newInputKwh: shiftedKwh / efficiency,
      savings: shiftedKwh * oldPrice - (shiftedKwh * newPrice) / efficiency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shiftedKwh: 100, oldPrice: 0.3, newPrice: 0.1, efficiency: 1 },
  output: { newInputKwh: 100, savings: 20 },
} satisfies ToolExample<Input, Output>;
export const timeOfUseWeekendShiftPriceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/time-of-use-weekend-shift-price-gap",
    title: "Time Of Use Weekend Shift Price Gap Tool",
    description:
      "Cost change for equal useful energy after a caller-supplied shifting efficiency, excluding demand charges.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftedKwh: { type: "number", minimum: 0 },
        oldPrice: { type: "number" },
        newPrice: { type: "number" },
        efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["shiftedKwh", "oldPrice", "newPrice", "efficiency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newInputKwh: { type: "number" },
        savings: { type: "number" },
      },
      required: ["newInputKwh", "savings"],
    },
    ports: {
      inputs: [
        {
          id: "shiftedKwh",
          label: "Shifted Kwh",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldPrice",
          label: "Old Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newPrice",
          label: "New Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "efficiency",
          label: "Efficiency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "newInputKwh",
          label: "New Input Kwh",
          valueType: { type: "number" },
        },
        { id: "savings", label: "Savings", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = timeOfUseWeekendShiftPriceGapTool.execute;
export default timeOfUseWeekendShiftPriceGapTool;
