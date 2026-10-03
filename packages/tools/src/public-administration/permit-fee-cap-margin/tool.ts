import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseFee: number;
  readonly perUnitFee: number;
  readonly quantity: number;
  readonly suppliedCap: number;
};
export type Output = {
  readonly uncappedFee: number;
  readonly appliedFee: number;
  readonly capMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseFee: { type: "number", minimum: 0 },
    perUnitFee: { type: "number", minimum: 0 },
    quantity: { type: "number", minimum: 0 },
    suppliedCap: { type: "number", minimum: 0 },
  },
  required: ["baseFee", "perUnitFee", "quantity", "suppliedCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncappedFee: { type: "number" },
    appliedFee: { type: "number" },
    capMargin: { type: "number" },
  },
  required: ["uncappedFee", "appliedFee", "capMargin"],
} as const;
/** Apply an explicit fee formula and cap, without selecting a jurisdiction or schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseFee, perUnitFee, quantity, suppliedCap } = request;
  const compute = (): Output => {
    H.domain(
      baseFee >= 0 && perUnitFee >= 0 && quantity >= 0 && suppliedCap >= 0,
    );
    return (() => {
      const uncappedFee = baseFee + perUnitFee * quantity;
      return {
        uncappedFee,
        appliedFee: Math.min(uncappedFee, suppliedCap),
        capMargin: suppliedCap - uncappedFee,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseFee: 10, perUnitFee: 2, quantity: 5, suppliedCap: 15 },
  output: { uncappedFee: 20, appliedFee: 15, capMargin: -5 },
} satisfies ToolExample<Input, Output>;
export const permitFeeCapMarginTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "public-administration/permit-fee-cap-margin",
    title: "Permit Fee Cap Margin Tool",
    description:
      "Apply an explicit fee formula and cap, without selecting a jurisdiction or schedule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseFee: { type: "number", minimum: 0 },
        perUnitFee: { type: "number", minimum: 0 },
        quantity: { type: "number", minimum: 0 },
        suppliedCap: { type: "number", minimum: 0 },
      },
      required: ["baseFee", "perUnitFee", "quantity", "suppliedCap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncappedFee: { type: "number" },
        appliedFee: { type: "number" },
        capMargin: { type: "number" },
      },
      required: ["uncappedFee", "appliedFee", "capMargin"],
    },
    ports: {
      inputs: [
        {
          id: "baseFee",
          label: "Base Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "perUnitFee",
          label: "Per Unit Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCap",
          label: "Supplied Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uncappedFee",
          label: "Uncapped Fee",
          valueType: { type: "number" },
        },
        {
          id: "appliedFee",
          label: "Applied Fee",
          valueType: { type: "number" },
        },
        { id: "capMargin", label: "Cap Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = permitFeeCapMarginTool.execute;
export default permitFeeCapMarginTool;
