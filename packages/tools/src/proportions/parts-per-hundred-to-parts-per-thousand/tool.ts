import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly partsPerHundred: number };
export type Output = { readonly partsPerThousand: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { partsPerHundred: { type: "number" } },
  required: ["partsPerHundred"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { partsPerThousand: { type: "number" } },
  required: ["partsPerThousand"],
} as const;
/** Rescale a signed dimensionless quantity from parts per hundred to parts per thousand without changing its reference base. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { partsPerHundred } = request;
  const compute = (): Output => {
    return { partsPerThousand: partsPerHundred * 10 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { partsPerHundred: 2.5 },
  output: { partsPerThousand: 25 },
} satisfies ToolExample<Input, Output>;
export const partsPerHundredToPartsPerThousandTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/parts-per-hundred-to-parts-per-thousand",
    title: "Parts Per Hundred To Parts Per Thousand Tool",
    description:
      "Rescale a signed dimensionless quantity from parts per hundred to parts per thousand without changing its reference base.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { partsPerHundred: { type: "number" } },
      required: ["partsPerHundred"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { partsPerThousand: { type: "number" } },
      required: ["partsPerThousand"],
    },
    ports: {
      inputs: [
        {
          id: "partsPerHundred",
          label: "Parts Per Hundred",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "partsPerThousand",
          label: "Parts Per Thousand",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = partsPerHundredToPartsPerThousandTool.execute;
export default partsPerHundredToPartsPerThousandTool;
