import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly solventFraction: number;
  readonly waterFraction: number;
};
export type Output = {
  readonly nonvolatileMass: number;
  readonly volatileMass: number;
  readonly solidsFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", minimum: 0 },
    solventFraction: { type: "number", minimum: 0 },
    waterFraction: { type: "number", minimum: 0 },
  },
  required: ["grossMass", "solventFraction", "waterFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nonvolatileMass: { type: "number" },
    volatileMass: { type: "number" },
    solidsFraction: { type: "number" },
  },
  required: ["nonvolatileMass", "volatileMass", "solidsFraction"],
} as const;
/** Calculate extract solvent free solids factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, solventFraction, waterFraction } = request;
  const compute = (): Output => {
    H.domain(
      grossMass >= 0 &&
        solventFraction >= 0 &&
        waterFraction >= 0 &&
        solventFraction + waterFraction <= 1,
    );
    return {
      nonvolatileMass: grossMass * (1 - solventFraction - waterFraction),
      volatileMass: grossMass * (solventFraction + waterFraction),
      solidsFraction: 1 - solventFraction - waterFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossMass: 100, solventFraction: 0.2, waterFraction: 0.1 },
  output: {
    nonvolatileMass: 70,
    volatileMass: 30.000000000000004,
    solidsFraction: 0.7000000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const extractSolventFreeSolidsFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/extract-solvent-free-solids-factor",
    title: "Extract Solvent Free Solids Factor Tool",
    description:
      "Calculate extract solvent free solids factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number", minimum: 0 },
        solventFraction: { type: "number", minimum: 0 },
        waterFraction: { type: "number", minimum: 0 },
      },
      required: ["grossMass", "solventFraction", "waterFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nonvolatileMass: { type: "number" },
        volatileMass: { type: "number" },
        solidsFraction: { type: "number" },
      },
      required: ["nonvolatileMass", "volatileMass", "solidsFraction"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solventFraction",
          label: "Solvent Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterFraction",
          label: "Water Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nonvolatileMass",
          label: "Nonvolatile Mass",
          valueType: { type: "number" },
        },
        {
          id: "volatileMass",
          label: "Volatile Mass",
          valueType: { type: "number" },
        },
        {
          id: "solidsFraction",
          label: "Solids Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = extractSolventFreeSolidsFactorTool.execute;
export default extractSolventFreeSolidsFactorTool;
