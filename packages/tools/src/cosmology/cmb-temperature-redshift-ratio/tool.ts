import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presentTemperature: number;
  readonly redshift: number;
};
export type Output = { readonly temperature: number; readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentTemperature: { type: "number", minimum: 0 },
    redshift: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["presentTemperature", "redshift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { temperature: { type: "number" }, ratio: { type: "number" } },
  required: ["temperature", "ratio"],
} as const;
/** Calculate cmb temperature redshift ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presentTemperature, redshift } = request;
  const compute = (): Output => {
    H.domain(presentTemperature >= 0 && redshift > -1);
    return {
      temperature: presentTemperature * (1 + redshift),
      ratio: 1 + redshift,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presentTemperature: 2.7255, redshift: 1 },
  output: { temperature: 5.451, ratio: 2 },
} satisfies ToolExample<Input, Output>;
export const cmbTemperatureRedshiftRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/cmb-temperature-redshift-ratio",
    title: "CMB Temperature Redshift Ratio Tool",
    description:
      "Calculate cmb temperature redshift ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentTemperature: { type: "number", minimum: 0 },
        redshift: { type: "number", exclusiveMinimum: -1 },
      },
      required: ["presentTemperature", "redshift"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        temperature: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["temperature", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "presentTemperature",
          label: "Present Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "redshift",
          label: "Redshift",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "temperature",
          label: "Temperature",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cmbTemperatureRedshiftRatioTool.execute;
export default cmbTemperatureRedshiftRatioTool;
