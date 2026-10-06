import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly printedUnit: string;
  readonly basisWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    printedUnit: { type: "string", maxLength: 8192, minLength: 1 },
    basisWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["productId", "printedUnit", "basisWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit agrochemical label unit and basis wording without recommending application. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, printedUnit, basisWording } = request;
  const compute = (): Output => {
    H.domain(productId.length > 0, "productId");
    H.domain(printedUnit.length > 0, "printedUnit");
    H.domain(basisWording.length > 0, "basisWording");
    return { token: JSON.stringify([productId, printedUnit, basisWording]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { productId: "PR17", printedUnit: "g/L", basisWording: "as supplied" },
  output: { token: '["PR17","g/L","as supplied"]' },
} satisfies ToolExample<Input, Output>;
export const agrochemicalLabelUnitBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrochemistry", "agriculture"],
      keywords: ["agrochemistry", "agriculture"],
    },
    id: "agrochemistry/agrochemical-label-unit-basis",
    title: "Agrochemical Label Unit Basis",
    description:
      "Preserve explicit agrochemical label unit and basis wording without recommending application.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "string", maxLength: 8192, minLength: 1 },
        printedUnit: { type: "string", maxLength: 8192, minLength: 1 },
        basisWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["productId", "printedUnit", "basisWording"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "productId",
          label: "Product Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "printedUnit",
          label: "Printed Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "basisWording",
          label: "Basis Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = agrochemicalLabelUnitBasisTool.execute;
export default agrochemicalLabelUnitBasisTool;
