import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly subunits: number;
  readonly subunitsPerMajor: number;
};
export type Output = { readonly majorUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subunits: { type: "number" },
    subunitsPerMajor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["subunits", "subunitsPerMajor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { majorUnits: { type: "number" } },
  required: ["majorUnits"],
} as const;
/** Convert supplied historical currency subunits using an explicit ratio, not a historical currency table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { subunits, subunitsPerMajor } = request;
  const compute = (): Output => {
    H.positive(subunitsPerMajor);
    return { majorUnits: subunits / subunitsPerMajor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { subunits: 240, subunitsPerMajor: 12 },
  output: { majorUnits: 20 },
} satisfies ToolExample<Input, Output>;
export const publicCurrencySubunitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/public-currency-subunit-factor",
    title: "Public Currency Subunit Factor Tool",
    description:
      "Convert supplied historical currency subunits using an explicit ratio, not a historical currency table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subunits: { type: "number" },
        subunitsPerMajor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["subunits", "subunitsPerMajor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { majorUnits: { type: "number" } },
      required: ["majorUnits"],
    },
    ports: {
      inputs: [
        {
          id: "subunits",
          label: "Subunits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subunitsPerMajor",
          label: "Subunits Per Major",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "majorUnits",
          label: "Major Units",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicCurrencySubunitFactorTool.execute;
export default publicCurrencySubunitFactorTool;
