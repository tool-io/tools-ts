import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousCredit: number;
  readonly revisedCredit: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousCredit: { type: "number" },
    revisedCredit: { type: "number" },
  },
  required: ["previousCredit", "revisedCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate revised-minus-previous supplied partial item credit without assigning scoring rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousCredit, revisedCredit } = request;
  const compute = (): Output => {
    return { signedGap: revisedCredit - previousCredit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousCredit: 12, revisedCredit: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const itemPartialCreditStepDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/item-partial-credit-step-difference",
    title: "Item Partial Credit Step Difference Tool",
    description:
      "Calculate revised-minus-previous supplied partial item credit without assigning scoring rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousCredit: { type: "number" },
        revisedCredit: { type: "number" },
      },
      required: ["previousCredit", "revisedCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "previousCredit",
          label: "Previous Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "revisedCredit",
          label: "Revised Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = itemPartialCreditStepDifferenceTool.execute;
export default itemPartialCreditStepDifferenceTool;
