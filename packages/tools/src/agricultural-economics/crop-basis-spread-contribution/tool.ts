import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localPrice: number;
  readonly referencePrice: number;
  readonly quantity: number;
};
export type Output = { readonly basis: number; readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localPrice: { type: "number" },
    referencePrice: { type: "number" },
    quantity: { type: "number", minimum: 0 },
  },
  required: ["localPrice", "referencePrice", "quantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { basis: { type: "number" }, contribution: { type: "number" } },
  required: ["basis", "contribution"],
} as const;
/** Calculate crop basis spread contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localPrice, referencePrice, quantity } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0);
    return {
      basis: localPrice - referencePrice,
      contribution: (localPrice - referencePrice) * quantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { localPrice: 180, referencePrice: 200, quantity: 5 },
  output: { basis: -20, contribution: -100 },
} satisfies ToolExample<Input, Output>;
export const cropBasisSpreadContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/crop-basis-spread-contribution",
    title: "Crop Basis Spread Contribution Tool",
    description:
      "Calculate crop basis spread contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localPrice: { type: "number" },
        referencePrice: { type: "number" },
        quantity: { type: "number", minimum: 0 },
      },
      required: ["localPrice", "referencePrice", "quantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basis: { type: "number" },
        contribution: { type: "number" },
      },
      required: ["basis", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "localPrice",
          label: "Local Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePrice",
          label: "Reference Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "basis", label: "Basis", valueType: { type: "number" } },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropBasisSpreadContributionTool.execute;
export default cropBasisSpreadContributionTool;
