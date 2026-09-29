import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: number;
  readonly suppliedDenominator: number;
  readonly denominatorKnown: boolean;
};
export type Output = {
  readonly ratioDefined: boolean;
  readonly ratio: number;
  readonly denominatorMissing: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "integer", minimum: 0 },
    suppliedDenominator: { type: "integer", minimum: 0 },
    denominatorKnown: { type: "boolean" },
  },
  required: ["numerator", "suppliedDenominator", "denominatorKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratioDefined: { type: "boolean" },
    ratio: { type: "number" },
    denominatorMissing: { type: "boolean" },
  },
  required: ["ratioDefined", "ratio", "denominatorMissing"],
} as const;
/** Preserve missing evidence denominators as explicit unknowns rather than treating them as zero observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numerator, suppliedDenominator, denominatorKnown } = request;
  const compute = (): Output => {
    H.integer(numerator, 0);
    H.integer(suppliedDenominator, 0);
    return {
      ratioDefined: denominatorKnown && suppliedDenominator > 0,
      ratio:
        denominatorKnown && suppliedDenominator > 0
          ? numerator / suppliedDenominator
          : 0,
      denominatorMissing: !denominatorKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numerator: 3, suppliedDenominator: 0, denominatorKnown: false },
  output: { ratioDefined: false, ratio: 0, denominatorMissing: true },
} satisfies ToolExample<Input, Output>;
export const evidenceDenominatorUnknownFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/evidence-denominator-unknown-flag",
    title: "Evidence Denominator Unknown Flag Tool",
    description:
      "Preserve missing evidence denominators as explicit unknowns rather than treating them as zero observations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numerator: { type: "integer", minimum: 0 },
        suppliedDenominator: { type: "integer", minimum: 0 },
        denominatorKnown: { type: "boolean" },
      },
      required: ["numerator", "suppliedDenominator", "denominatorKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratioDefined: { type: "boolean" },
        ratio: { type: "number" },
        denominatorMissing: { type: "boolean" },
      },
      required: ["ratioDefined", "ratio", "denominatorMissing"],
    },
    ports: {
      inputs: [
        {
          id: "numerator",
          label: "Numerator",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedDenominator",
          label: "Supplied Denominator",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "denominatorKnown",
          label: "Denominator Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "ratioDefined",
          label: "Ratio Defined",
          valueType: { type: "boolean" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "denominatorMissing",
          label: "Denominator Missing",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = evidenceDenominatorUnknownFlagTool.execute;
export default evidenceDenominatorUnknownFlagTool;
