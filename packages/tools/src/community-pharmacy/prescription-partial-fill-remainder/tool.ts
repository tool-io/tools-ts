import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorizedQuantity: number;
  readonly cumulativeFilledQuantity: number;
};
export type Output = {
  readonly remainingQuantity: number;
  readonly overfilled: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorizedQuantity: { type: "number", minimum: 0 },
    cumulativeFilledQuantity: { type: "number", minimum: 0 },
  },
  required: ["authorizedQuantity", "cumulativeFilledQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingQuantity: { type: "number" },
    overfilled: { type: "boolean" },
  },
  required: ["remainingQuantity", "overfilled"],
} as const;
/** Subtract explicit cumulative fills from an authorized quantity on the same unit basis without dispensing advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorizedQuantity, cumulativeFilledQuantity } = request;
  const compute = (): Output => {
    H.domain(
      authorizedQuantity >= 0 && cumulativeFilledQuantity >= 0,
      "authorizedQuantity",
    );
    return {
      remainingQuantity: authorizedQuantity - cumulativeFilledQuantity,
      overfilled: cumulativeFilledQuantity > authorizedQuantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { authorizedQuantity: 30, cumulativeFilledQuantity: 12 },
  output: { remainingQuantity: 18, overfilled: false },
} satisfies ToolExample<Input, Output>;
export const prescriptionPartialFillRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["community-pharmacy", "community pharmacy", "pharmacy"],
      keywords: ["community pharmacy", "pharmacy"],
    },
    id: "community-pharmacy/prescription-partial-fill-remainder",
    title: "Prescription Partial Fill Remainder",
    description:
      "Subtract explicit cumulative fills from an authorized quantity on the same unit basis without dispensing advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorizedQuantity: { type: "number", minimum: 0 },
        cumulativeFilledQuantity: { type: "number", minimum: 0 },
      },
      required: ["authorizedQuantity", "cumulativeFilledQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingQuantity: { type: "number" },
        overfilled: { type: "boolean" },
      },
      required: ["remainingQuantity", "overfilled"],
    },
    ports: {
      inputs: [
        {
          id: "authorizedQuantity",
          label: "Authorized Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cumulativeFilledQuantity",
          label: "Cumulative Filled Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingQuantity",
          label: "Remaining Quantity",
          valueType: { type: "number" },
        },
        {
          id: "overfilled",
          label: "Overfilled",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = prescriptionPartialFillRemainderTool.execute;
export default prescriptionPartialFillRemainderTool;
