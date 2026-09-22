import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publicationYear: number;
  readonly citationYear: number;
  readonly zeroWindowAllowed: boolean;
};
export type Output = { readonly age: number; readonly eligible: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationYear: { type: "integer" },
    citationYear: { type: "integer" },
    zeroWindowAllowed: { type: "boolean" },
  },
  required: ["publicationYear", "citationYear", "zeroWindowAllowed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { age: { type: "integer" }, eligible: { type: "boolean" } },
  required: ["age", "eligible"],
} as const;
/** Calculate citation age zero window token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publicationYear, citationYear, zeroWindowAllowed } = request;
  const compute = (): Output => {
    return {
      age: citationYear - publicationYear,
      eligible:
        citationYear > publicationYear ||
        (citationYear === publicationYear && zeroWindowAllowed),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    publicationYear: 2025,
    citationYear: 2025,
    zeroWindowAllowed: false,
  },
  output: { age: 0, eligible: false },
} satisfies ToolExample<Input, Output>;
export const citationAgeZeroWindowTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/citation-age-zero-window-token",
    title: "Citation Age Zero Window Token Tool",
    description:
      "Calculate citation age zero window token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        publicationYear: { type: "integer" },
        citationYear: { type: "integer" },
        zeroWindowAllowed: { type: "boolean" },
      },
      required: ["publicationYear", "citationYear", "zeroWindowAllowed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { age: { type: "integer" }, eligible: { type: "boolean" } },
      required: ["age", "eligible"],
    },
    ports: {
      inputs: [
        {
          id: "publicationYear",
          label: "Publication Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "citationYear",
          label: "Citation Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "zeroWindowAllowed",
          label: "Zero Window Allowed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "age", label: "Age", valueType: { type: "integer" } },
        { id: "eligible", label: "Eligible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = citationAgeZeroWindowTokenTool.execute;
export default citationAgeZeroWindowTokenTool;
