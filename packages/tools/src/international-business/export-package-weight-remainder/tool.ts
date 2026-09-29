import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossWeight: number;
  readonly contentsWeight: number;
  readonly tareWeight: number;
};
export type Output = { readonly unaccountedWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossWeight: { type: "number", minimum: 0 },
    contentsWeight: { type: "number", minimum: 0 },
    tareWeight: { type: "number", minimum: 0 },
  },
  required: ["grossWeight", "contentsWeight", "tareWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unaccountedWeight: { type: "number" } },
  required: ["unaccountedWeight"],
} as const;
/** Calculate export package weight remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossWeight, contentsWeight, tareWeight } = request;
  const compute = (): Output => {
    H.domain(grossWeight >= 0 && contentsWeight >= 0 && tareWeight >= 0);
    return { unaccountedWeight: grossWeight - contentsWeight - tareWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossWeight: 100, contentsWeight: 80, tareWeight: 15 },
  output: { unaccountedWeight: 5 },
} satisfies ToolExample<Input, Output>;
export const exportPackageWeightRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/export-package-weight-remainder",
    title: "Export Package Weight Remainder Tool",
    description:
      "Calculate export package weight remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossWeight: { type: "number", minimum: 0 },
        contentsWeight: { type: "number", minimum: 0 },
        tareWeight: { type: "number", minimum: 0 },
      },
      required: ["grossWeight", "contentsWeight", "tareWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unaccountedWeight: { type: "number" } },
      required: ["unaccountedWeight"],
    },
    ports: {
      inputs: [
        {
          id: "grossWeight",
          label: "Gross Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contentsWeight",
          label: "Contents Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tareWeight",
          label: "Tare Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unaccountedWeight",
          label: "Unaccounted Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exportPackageWeightRemainderTool.execute;
export default exportPackageWeightRemainderTool;
