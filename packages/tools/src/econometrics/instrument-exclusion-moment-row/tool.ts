import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instrumentValue: number;
  readonly structuralResidual: number;
};
export type Output = { readonly momentContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instrumentValue: { type: "number" },
    structuralResidual: { type: "number" },
  },
  required: ["instrumentValue", "structuralResidual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { momentContribution: { type: "number" } },
  required: ["momentContribution"],
} as const;
/** Multiply supplied instrument value by structural residual for one exclusion-moment contribution without establishing instrument validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instrumentValue, structuralResidual } = request;
  const compute = (): Output => {
    return { momentContribution: instrumentValue * structuralResidual };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { instrumentValue: 2, structuralResidual: -3 },
  output: { momentContribution: -6 },
} satisfies ToolExample<Input, Output>;
export const instrumentExclusionMomentRowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/instrument-exclusion-moment-row",
    title: "Instrument Exclusion Moment Row Tool",
    description:
      "Multiply supplied instrument value by structural residual for one exclusion-moment contribution without establishing instrument validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        instrumentValue: { type: "number" },
        structuralResidual: { type: "number" },
      },
      required: ["instrumentValue", "structuralResidual"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { momentContribution: { type: "number" } },
      required: ["momentContribution"],
    },
    ports: {
      inputs: [
        {
          id: "instrumentValue",
          label: "Instrument Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "structuralResidual",
          label: "Structural Residual",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "momentContribution",
          label: "Moment Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = instrumentExclusionMomentRowTool.execute;
export default instrumentExclusionMomentRowTool;
