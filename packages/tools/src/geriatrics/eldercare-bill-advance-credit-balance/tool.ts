import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bill: number;
  readonly openingCredit: number;
  readonly advance: number;
  readonly appliedCredit: number;
};
export type Output = {
  readonly availableCredit: number;
  readonly balanceDue: number;
  readonly closingCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bill: { type: "number", minimum: 0 },
    openingCredit: { type: "number", minimum: 0 },
    advance: { type: "number", minimum: 0 },
    appliedCredit: { type: "number", minimum: 0 },
  },
  required: ["bill", "openingCredit", "advance", "appliedCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableCredit: { type: "number" },
    balanceDue: { type: "number" },
    closingCredit: { type: "number" },
  },
  required: ["availableCredit", "balanceDue", "closingCredit"],
} as const;
/** Calculate eldercare bill advance credit balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bill, openingCredit, advance, appliedCredit } = request;
  const compute = (): Output => {
    H.domain(
      bill >= 0 &&
        openingCredit >= 0 &&
        advance >= 0 &&
        appliedCredit >= 0 &&
        appliedCredit <= Math.min(bill, openingCredit + advance),
    );
    return {
      availableCredit: openingCredit + advance,
      balanceDue: bill - appliedCredit,
      closingCredit: openingCredit + advance - appliedCredit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bill: 500, openingCredit: 100, advance: 200, appliedCredit: 250 },
  output: { availableCredit: 300, balanceDue: 250, closingCredit: 50 },
} satisfies ToolExample<Input, Output>;
export const eldercareBillAdvanceCreditBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/eldercare-bill-advance-credit-balance",
    title: "Eldercare Bill Advance Credit Balance Tool",
    description:
      "Calculate eldercare bill advance credit balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bill: { type: "number", minimum: 0 },
        openingCredit: { type: "number", minimum: 0 },
        advance: { type: "number", minimum: 0 },
        appliedCredit: { type: "number", minimum: 0 },
      },
      required: ["bill", "openingCredit", "advance", "appliedCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableCredit: { type: "number" },
        balanceDue: { type: "number" },
        closingCredit: { type: "number" },
      },
      required: ["availableCredit", "balanceDue", "closingCredit"],
    },
    ports: {
      inputs: [
        {
          id: "bill",
          label: "Bill",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openingCredit",
          label: "Opening Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "advance",
          label: "Advance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "appliedCredit",
          label: "Applied Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableCredit",
          label: "Available Credit",
          valueType: { type: "number" },
        },
        {
          id: "balanceDue",
          label: "Balance Due",
          valueType: { type: "number" },
        },
        {
          id: "closingCredit",
          label: "Closing Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eldercareBillAdvanceCreditBalanceTool.execute;
export default eldercareBillAdvanceCreditBalanceTool;
