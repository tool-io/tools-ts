import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leadingCoefficient: number;
  readonly order: number;
};
export type Output = { readonly differenceSign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadingCoefficient: { type: "number" },
    order: { type: "integer", minimum: 0 },
  },
  required: ["leadingCoefficient", "order"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { differenceSign: { type: "integer" } },
  required: ["differenceSign"],
} as const;
/** Report the sign of a degree-order polynomial forward difference on a positive unit grid from its supplied leading coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leadingCoefficient, order } = request;
  const compute = (): Output => {
    H.integer(order, 0);
    return { differenceSign: Math.sign(leadingCoefficient) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leadingCoefficient: -2, order: 3 },
  output: { differenceSign: -1 },
} satisfies ToolExample<Input, Output>;
export const finiteDifferenceLeadingSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/finite-difference-leading-sign",
    title: "Finite Difference Leading Sign Tool",
    description:
      "Report the sign of a degree-order polynomial forward difference on a positive unit grid from its supplied leading coefficient.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leadingCoefficient: { type: "number" },
        order: { type: "integer", minimum: 0 },
      },
      required: ["leadingCoefficient", "order"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { differenceSign: { type: "integer" } },
      required: ["differenceSign"],
    },
    ports: {
      inputs: [
        {
          id: "leadingCoefficient",
          label: "Leading Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "order",
          label: "Order",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "differenceSign",
          label: "Difference Sign",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = finiteDifferenceLeadingSignTool.execute;
export default finiteDifferenceLeadingSignTool;
