import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly redshift: number;
  readonly suppliedScaleFactor: number;
};
export type Output = {
  readonly derivedScaleFactor: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    redshift: { type: "number", exclusiveMinimum: -1 },
    suppliedScaleFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["redshift", "suppliedScaleFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivedScaleFactor: { type: "number" },
    gap: { type: "number" },
  },
  required: ["derivedScaleFactor", "gap"],
} as const;
/** Compare supplied cosmological scale factor with a=1/(1+z), using present scale factor one. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { redshift, suppliedScaleFactor } = request;
  const compute = (): Output => {
    H.domain(redshift > -1);
    H.positive(suppliedScaleFactor);
    return {
      derivedScaleFactor: 1 / (1 + redshift),
      gap: suppliedScaleFactor - 1 / (1 + redshift),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { redshift: 3, suppliedScaleFactor: 0.3 },
  output: { derivedScaleFactor: 0.25, gap: 0.04999999999999999 },
} satisfies ToolExample<Input, Output>;
export const redshiftScaleFactorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/redshift-scale-factor-gap",
    title: "Redshift Scale Factor Gap Tool",
    description:
      "Compare supplied cosmological scale factor with a=1/(1+z), using present scale factor one.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        redshift: { type: "number", exclusiveMinimum: -1 },
        suppliedScaleFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["redshift", "suppliedScaleFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        derivedScaleFactor: { type: "number" },
        gap: { type: "number" },
      },
      required: ["derivedScaleFactor", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "redshift",
          label: "Redshift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScaleFactor",
          label: "Supplied Scale Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivedScaleFactor",
          label: "Derived Scale Factor",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = redshiftScaleFactorGapTool.execute;
export default redshiftScaleFactorGapTool;
