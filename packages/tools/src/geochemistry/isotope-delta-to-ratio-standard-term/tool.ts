import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deltaPerMil: number;
  readonly standardRatio: number;
};
export type Output = { readonly sampleRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deltaPerMil: { type: "number", minimum: -1000 },
    standardRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["deltaPerMil", "standardRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sampleRatio: { type: "number" } },
  required: ["sampleRatio"],
} as const;
/** Delta notation delta=1000*(Rsample/Rstandard-1), with an explicit positive standard ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deltaPerMil, standardRatio } = request;
  const compute = (): Output => {
    H.domain(deltaPerMil >= -1000);
    H.positive(standardRatio);
    return { sampleRatio: standardRatio * (1 + deltaPerMil / 1000) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deltaPerMil: 10, standardRatio: 0.01 },
  output: { sampleRatio: 0.0101 },
} satisfies ToolExample<Input, Output>;
export const isotopeDeltaToRatioStandardTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/isotope-delta-to-ratio-standard-term",
    title: "Isotope Delta To Ratio Standard Term Tool",
    description:
      "Delta notation delta=1000*(Rsample/Rstandard-1), with an explicit positive standard ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deltaPerMil: { type: "number", minimum: -1000 },
        standardRatio: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["deltaPerMil", "standardRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sampleRatio: { type: "number" } },
      required: ["sampleRatio"],
    },
    ports: {
      inputs: [
        {
          id: "deltaPerMil",
          label: "Delta Per Mil",
          required: true,
          valueType: { type: "number", unit: "‰" },
        },
        {
          id: "standardRatio",
          label: "Standard Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampleRatio",
          label: "Sample Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = isotopeDeltaToRatioStandardTermTool.execute;
export default isotopeDeltaToRatioStandardTermTool;
