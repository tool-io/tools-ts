import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstExpiry: number;
  readonly secondExpiry: number;
};
export type Output = { readonly gap: number; readonly earlierLot: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstExpiry: { type: "number" },
    secondExpiry: { type: "number" },
  },
  required: ["firstExpiry", "secondExpiry"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gap: { type: "number" },
    earlierLot: { type: "string", maxLength: 8192 },
  },
  required: ["gap", "earlierLot"],
} as const;
/** Calculate lot expiry priority gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstExpiry, secondExpiry } = request;
  const compute = (): Output => {
    return {
      gap: secondExpiry - firstExpiry,
      earlierLot:
        firstExpiry < secondExpiry
          ? "first"
          : firstExpiry > secondExpiry
            ? "second"
            : "tie",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstExpiry: 10, secondExpiry: 15 },
  output: { gap: 5, earlierLot: "first" },
} satisfies ToolExample<Input, Output>;
export const lotExpiryPriorityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/lot-expiry-priority-gap",
    title: "Lot Expiry Priority Gap Tool",
    description:
      "Calculate lot expiry priority gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstExpiry: { type: "number" },
        secondExpiry: { type: "number" },
      },
      required: ["firstExpiry", "secondExpiry"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "number" },
        earlierLot: { type: "string", maxLength: 8192 },
      },
      required: ["gap", "earlierLot"],
    },
    ports: {
      inputs: [
        {
          id: "firstExpiry",
          label: "First Expiry",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondExpiry",
          label: "Second Expiry",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "earlierLot",
          label: "Earlier Lot",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = lotExpiryPriorityGapTool.execute;
export default lotExpiryPriorityGapTool;
