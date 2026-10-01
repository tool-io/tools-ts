import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly definitionYear: number;
  readonly referenceYear: number;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    definitionYear: { type: "integer" },
    referenceYear: { type: "integer" },
  },
  required: ["definitionYear", "referenceYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "integer" } },
  required: ["offset"],
} as const;
/** Calculate public definition source year offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { definitionYear, referenceYear } = request;
  const compute = (): Output => {
    return { offset: Number(BigInt(definitionYear) - BigInt(referenceYear)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { definitionYear: 2024, referenceYear: 2020 },
  output: { offset: 4 },
} satisfies ToolExample<Input, Output>;
export const publicDefinitionSourceYearOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/public-definition-source-year-offset",
    title: "Public Definition Source Year Offset Tool",
    description:
      "Calculate public definition source year offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        definitionYear: { type: "integer" },
        referenceYear: { type: "integer" },
      },
      required: ["definitionYear", "referenceYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "integer" } },
      required: ["offset"],
    },
    ports: {
      inputs: [
        {
          id: "definitionYear",
          label: "Definition Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceYear",
          label: "Reference Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = publicDefinitionSourceYearOffsetTool.execute;
export default publicDefinitionSourceYearOffsetTool;
