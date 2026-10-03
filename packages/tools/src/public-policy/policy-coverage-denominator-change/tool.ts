import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly covered: number;
  readonly oldDenominator: number;
  readonly newDenominator: number;
};
export type Output = {
  readonly oldShare: number;
  readonly newShare: number;
  readonly shareChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    covered: { type: "integer", minimum: 0 },
    oldDenominator: { type: "integer", minimum: 1 },
    newDenominator: { type: "integer", minimum: 1 },
  },
  required: ["covered", "oldDenominator", "newDenominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldShare: { type: "number" },
    newShare: { type: "number" },
    shareChange: { type: "number" },
  },
  required: ["oldShare", "newShare", "shareChange"],
} as const;
/** Isolate the effect of a supplied coverage-denominator change with the numerator held fixed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { covered, oldDenominator, newDenominator } = request;
  const compute = (): Output => {
    H.integer(oldDenominator, 1);
    H.integer(newDenominator, 1);
    H.integer(covered, 0, Math.min(oldDenominator, newDenominator));
    return {
      oldShare: covered / oldDenominator,
      newShare: covered / newDenominator,
      shareChange: covered / newDenominator - covered / oldDenominator,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { covered: 40, oldDenominator: 100, newDenominator: 80 },
  output: { oldShare: 0.4, newShare: 0.5, shareChange: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const policyCoverageDenominatorChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-coverage-denominator-change",
    title: "Policy Coverage Denominator Change Tool",
    description:
      "Isolate the effect of a supplied coverage-denominator change with the numerator held fixed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        covered: { type: "integer", minimum: 0 },
        oldDenominator: { type: "integer", minimum: 1 },
        newDenominator: { type: "integer", minimum: 1 },
      },
      required: ["covered", "oldDenominator", "newDenominator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldShare: { type: "number" },
        newShare: { type: "number" },
        shareChange: { type: "number" },
      },
      required: ["oldShare", "newShare", "shareChange"],
    },
    ports: {
      inputs: [
        {
          id: "covered",
          label: "Covered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oldDenominator",
          label: "Old Denominator",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newDenominator",
          label: "New Denominator",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "oldShare", label: "Old Share", valueType: { type: "number" } },
        { id: "newShare", label: "New Share", valueType: { type: "number" } },
        {
          id: "shareChange",
          label: "Share Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyCoverageDenominatorChangeTool.execute;
export default policyCoverageDenominatorChangeTool;
