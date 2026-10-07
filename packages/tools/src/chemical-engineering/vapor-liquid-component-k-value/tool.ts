import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vaporMoleFraction: number;
  readonly liquidMoleFraction: number;
};
export type Output = { readonly equilibriumKValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vaporMoleFraction: { type: "number", minimum: 0, maximum: 1 },
    liquidMoleFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["vaporMoleFraction", "liquidMoleFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equilibriumKValue: { type: "number" } },
  required: ["equilibriumKValue"],
} as const;
/** Describe a supplied vapor/liquid mole-fraction ratio for one component without predicting phase equilibrium. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vaporMoleFraction, liquidMoleFraction } = request;
  const compute = (): Output => {
    (H.domain(
      vaporMoleFraction >= 0 && vaporMoleFraction <= 1,
      "vaporMoleFraction",
    ),
      vaporMoleFraction);
    H.domain(
      liquidMoleFraction > 0 && liquidMoleFraction <= 1,
      "liquidMoleFraction",
    );
    return { equilibriumKValue: vaporMoleFraction / liquidMoleFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vaporMoleFraction: 0.4, liquidMoleFraction: 0.2 },
  output: { equilibriumKValue: 2 },
} satisfies ToolExample<Input, Output>;
export const vaporLiquidComponentKvalueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["chemical-engineering", "chemical engineering", "engineering"],
      keywords: ["chemical engineering", "engineering"],
    },
    id: "chemical-engineering/vapor-liquid-component-k-value",
    title: "Vapor Liquid Component K-Value",
    description:
      "Describe a supplied vapor/liquid mole-fraction ratio for one component without predicting phase equilibrium.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vaporMoleFraction: { type: "number", minimum: 0, maximum: 1 },
        liquidMoleFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["vaporMoleFraction", "liquidMoleFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equilibriumKValue: { type: "number" } },
      required: ["equilibriumKValue"],
    },
    ports: {
      inputs: [
        {
          id: "vaporMoleFraction",
          label: "Vapor Mole Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liquidMoleFraction",
          label: "Liquid Mole Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equilibriumKValue",
          label: "Equilibrium KValue",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vaporLiquidComponentKvalueTool.execute;
export default vaporLiquidComponentKvalueTool;
