import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pressureLoss: number;
  readonly measuredDensity: number;
  readonly referenceDensity: number;
};
export type Output = { readonly referencePressureLoss: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressureLoss: { type: "number", minimum: 0 },
    measuredDensity: { type: "number", exclusiveMinimum: 0 },
    referenceDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pressureLoss", "measuredDensity", "referenceDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referencePressureLoss: { type: "number" } },
  required: ["referencePressureLoss"],
} as const;
/** Rescale a supplied dynamic pressure loss with density at fixed velocity and loss coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pressureLoss, measuredDensity, referenceDensity } = request;
  const compute = (): Output => {
    H.domain(pressureLoss >= 0);
    H.positive(measuredDensity);
    H.positive(referenceDensity);
    return {
      referencePressureLoss:
        (pressureLoss * referenceDensity) / measuredDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pressureLoss: 100, measuredDensity: 2, referenceDensity: 1 },
  output: { referencePressureLoss: 50 },
} satisfies ToolExample<Input, Output>;
export const pressureLossReferenceDensityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/pressure-loss-reference-density-factor",
    title: "Pressure Loss Reference Density Factor Tool",
    description:
      "Rescale a supplied dynamic pressure loss with density at fixed velocity and loss coefficient.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressureLoss: { type: "number", minimum: 0 },
        measuredDensity: { type: "number", exclusiveMinimum: 0 },
        referenceDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pressureLoss", "measuredDensity", "referenceDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referencePressureLoss: { type: "number" } },
      required: ["referencePressureLoss"],
    },
    ports: {
      inputs: [
        {
          id: "pressureLoss",
          label: "Pressure Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredDensity",
          label: "Measured Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDensity",
          label: "Reference Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referencePressureLoss",
          label: "Reference Pressure Loss",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pressureLossReferenceDensityFactorTool.execute;
export default pressureLossReferenceDensityFactorTool;
