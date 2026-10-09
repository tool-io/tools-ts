import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dispatchDate: string;
  readonly receiptDate: string;
};
export type Output = {
  readonly signedTransitDays: number;
  readonly receiptBeforeDispatch: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispatchDate: { type: "string", maxLength: 8192 },
    receiptDate: { type: "string", maxLength: 8192 },
  },
  required: ["dispatchDate", "receiptDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedTransitDays: { type: "integer" },
    receiptBeforeDispatch: { type: "boolean" },
  },
  required: ["signedTransitDays", "receiptBeforeDispatch"],
} as const;
/** Compare explicit shipment dispatch and receipt calendar dates without assuming transport conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dispatchDate, receiptDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    return {
      signedTransitDays:
        (namedDate(receiptDate, "receiptDate").getTime() -
          namedDate(dispatchDate, "dispatchDate").getTime()) /
        86400000,
      receiptBeforeDispatch:
        namedDate(receiptDate, "receiptDate") <
        namedDate(dispatchDate, "dispatchDate"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dispatchDate: "2026-10-28", receiptDate: "2026-11-01" },
  output: { signedTransitDays: 4, receiptBeforeDispatch: false },
} satisfies ToolExample<Input, Output>;
export const foodTraceabilityShipmentDateOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["food-safety", "food safety", "research and quality management"],
      keywords: ["food safety", "research and quality management"],
    },
    id: "food-safety/food-traceability-shipment-date-order",
    title: "Food Traceability Shipment Date Order",
    description:
      "Compare explicit shipment dispatch and receipt calendar dates without assuming transport conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dispatchDate: { type: "string", maxLength: 8192 },
        receiptDate: { type: "string", maxLength: 8192 },
      },
      required: ["dispatchDate", "receiptDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedTransitDays: { type: "integer" },
        receiptBeforeDispatch: { type: "boolean" },
      },
      required: ["signedTransitDays", "receiptBeforeDispatch"],
    },
    ports: {
      inputs: [
        {
          id: "dispatchDate",
          label: "Dispatch Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "receiptDate",
          label: "Receipt Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedTransitDays",
          label: "Signed Transit Days",
          valueType: { type: "integer" },
        },
        {
          id: "receiptBeforeDispatch",
          label: "Receipt Before Dispatch",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodTraceabilityShipmentDateOrderTool.execute;
export default foodTraceabilityShipmentDateOrderTool;
