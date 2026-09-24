import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly molesPerVolume: number;
  readonly avogadroConstant: number;
};
export type Output = { readonly particlesPerVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molesPerVolume: { type: "number", minimum: 0 },
    avogadroConstant: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["molesPerVolume", "avogadroConstant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { particlesPerVolume: { type: "number" } },
  required: ["particlesPerVolume"],
} as const;
/** Convert molar amount concentration to particle number density with an explicit Avogadro constant. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { molesPerVolume, avogadroConstant } = input;
  const compute = (): Output => {
    H.domain(molesPerVolume >= 0);
    H.positive(avogadroConstant);
    return { particlesPerVolume: molesPerVolume * avogadroConstant };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { molesPerVolume: 2, avogadroConstant: 6.02214076e23 },
  output: { particlesPerVolume: 1.204428152e24 },
} satisfies ToolExample<Input, Output>;
export const amountConcentrationNumberDensityCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/amount-concentration-number-density-crosswalk",
      title: "Amount Concentration Number Density Crosswalk Tool",
      description:
        "Convert molar amount concentration to particle number density with an explicit Avogadro constant.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          molesPerVolume: { type: "number", minimum: 0 },
          avogadroConstant: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["molesPerVolume", "avogadroConstant"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { particlesPerVolume: { type: "number" } },
        required: ["particlesPerVolume"],
      },
      ports: {
        inputs: [
          {
            id: "molesPerVolume",
            label: "Moles Per Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "avogadroConstant",
            label: "Avogadro Constant",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "particlesPerVolume",
            label: "Particles Per Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = amountConcentrationNumberDensityCrosswalkTool.execute;
export default amountConcentrationNumberDensityCrosswalkTool;
