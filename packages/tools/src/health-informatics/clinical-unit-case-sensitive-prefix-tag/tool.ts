import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstUnit: string; readonly secondUnit: string };
export type Output = {
  readonly exactMatch: boolean;
  readonly caseOnlyDifference: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstUnit: { type: "string", maxLength: 8192 },
    secondUnit: { type: "string", maxLength: 8192 },
  },
  required: ["firstUnit", "secondUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exactMatch: { type: "boolean" },
    caseOnlyDifference: { type: "boolean" },
  },
  required: ["exactMatch", "caseOnlyDifference"],
} as const;
/** Detect exact versus case-only unit spelling differences; no automatic UCUM case normalization or dimensional equivalence is asserted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstUnit, secondUnit } = request;
  const compute = (): Output => {
    H.domain(firstUnit.length > 0 && secondUnit.length > 0);
    return {
      exactMatch: firstUnit === secondUnit,
      caseOnlyDifference:
        firstUnit !== secondUnit &&
        firstUnit.toLowerCase() === secondUnit.toLowerCase(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstUnit: "mL", secondUnit: "ml" },
  output: { exactMatch: false, caseOnlyDifference: true },
} satisfies ToolExample<Input, Output>;
export const clinicalUnitCaseSensitivePrefixTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/clinical-unit-case-sensitive-prefix-tag",
    title: "Clinical Unit Case Sensitive Prefix Tag Tool",
    description:
      "Detect exact versus case-only unit spelling differences; no automatic UCUM case normalization or dimensional equivalence is asserted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstUnit: { type: "string", maxLength: 8192 },
        secondUnit: { type: "string", maxLength: 8192 },
      },
      required: ["firstUnit", "secondUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exactMatch: { type: "boolean" },
        caseOnlyDifference: { type: "boolean" },
      },
      required: ["exactMatch", "caseOnlyDifference"],
    },
    ports: {
      inputs: [
        {
          id: "firstUnit",
          label: "First Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondUnit",
          label: "Second Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "exactMatch",
          label: "Exact Match",
          valueType: { type: "boolean" },
        },
        {
          id: "caseOnlyDifference",
          label: "Case Only Difference",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = clinicalUnitCaseSensitivePrefixTagTool.execute;
export default clinicalUnitCaseSensitivePrefixTagTool;
