import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presentDensity: number;
  readonly redshift: number;
  readonly equationOfState: number;
};
export type Output = {
  readonly densityFactor: number;
  readonly density: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentDensity: { type: "number", minimum: 0 },
    redshift: { type: "number", exclusiveMinimum: -1 },
    equationOfState: { type: "number" },
  },
  required: ["presentDensity", "redshift", "equationOfState"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    densityFactor: { type: "number" },
    density: { type: "number" },
  },
  required: ["densityFactor", "density"],
} as const;
/** Constant equation-of-state fluid with no interaction term; w=-1 gives constant density. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presentDensity, redshift, equationOfState } = request;
  const compute = (): Output => {
    H.domain(presentDensity >= 0 && redshift > -1);
    return {
      densityFactor: (1 + redshift) ** (3 * (1 + equationOfState)),
      density: presentDensity * (1 + redshift) ** (3 * (1 + equationOfState)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presentDensity: 5, redshift: 2, equationOfState: -1 },
  output: { densityFactor: 1, density: 5 },
} satisfies ToolExample<Input, Output>;
export const darkEnergyConstantWDensityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/dark-energy-constant-w-density-factor",
    title: "Dark Energy Constant W Density Factor Tool",
    description:
      "Constant equation-of-state fluid with no interaction term; w=-1 gives constant density.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentDensity: { type: "number", minimum: 0 },
        redshift: { type: "number", exclusiveMinimum: -1 },
        equationOfState: { type: "number" },
      },
      required: ["presentDensity", "redshift", "equationOfState"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        densityFactor: { type: "number" },
        density: { type: "number" },
      },
      required: ["densityFactor", "density"],
    },
    ports: {
      inputs: [
        {
          id: "presentDensity",
          label: "Present Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "redshift",
          label: "Redshift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equationOfState",
          label: "Equation Of State",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "densityFactor",
          label: "Density Factor",
          valueType: { type: "number" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = darkEnergyConstantWDensityFactorTool.execute;
export default darkEnergyConstantWDensityFactorTool;
