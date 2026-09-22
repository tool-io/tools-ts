import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly fluctuations: readonly number[] };
export type Output = {
  readonly meanSquare: number;
  readonly tkeContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fluctuations: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["fluctuations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanSquare: { type: "number" },
    tkeContribution: { type: "number" },
  },
  required: ["meanSquare", "tkeContribution"],
} as const;
/** Half the population mean square of one caller-supplied velocity-fluctuation component; the mean must already be removed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fluctuations } = request;
  const compute = (): Output => {
    H.domain(fluctuations.length > 0);
    return {
      meanSquare:
        fluctuations.reduce((s, x) => s + x * x, 0) / fluctuations.length,
      tkeContribution:
        fluctuations.reduce((s, x) => s + x * x, 0) / (2 * fluctuations.length),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fluctuations: [2, -2] },
  output: { meanSquare: 4, tkeContribution: 2 },
} satisfies ToolExample<Input, Output>;
export const turbulentKineticEnergyOneComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/turbulent-kinetic-energy-one-component",
    title: "Turbulent Kinetic Energy One Component Tool",
    description:
      "Half the population mean square of one caller-supplied velocity-fluctuation component; the mean must already be removed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fluctuations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["fluctuations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanSquare: { type: "number" },
        tkeContribution: { type: "number" },
      },
      required: ["meanSquare", "tkeContribution"],
    },
    ports: {
      inputs: [
        {
          id: "fluctuations",
          label: "Fluctuations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "meanSquare",
          label: "Mean Square",
          valueType: { type: "number" },
        },
        {
          id: "tkeContribution",
          label: "Tke Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = turbulentKineticEnergyOneComponentTool.execute;
export default turbulentKineticEnergyOneComponentTool;
