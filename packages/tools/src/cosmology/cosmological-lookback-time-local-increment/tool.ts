import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly redshift: number;
  readonly redshiftIncrement: number;
  readonly hubbleAtRedshift: number;
};
export type Output = { readonly lookbackIncrement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    redshift: { type: "number", exclusiveMinimum: -1 },
    redshiftIncrement: { type: "number" },
    hubbleAtRedshift: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["redshift", "redshiftIncrement", "hubbleAtRedshift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lookbackIncrement: { type: "number" } },
  required: ["lookbackIncrement"],
} as const;
/** Local differential dtLookback=dz/[(1+z)*H(z)], rather than a finite-redshift integration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { redshift, redshiftIncrement, hubbleAtRedshift } = request;
  const compute = (): Output => {
    H.domain(redshift > -1);
    H.positive(hubbleAtRedshift);
    return {
      lookbackIncrement:
        redshiftIncrement / ((1 + redshift) * hubbleAtRedshift),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { redshift: 1, redshiftIncrement: 0.1, hubbleAtRedshift: 2 },
  output: { lookbackIncrement: 0.025 },
} satisfies ToolExample<Input, Output>;
export const cosmologicalLookbackTimeLocalIncrementTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cosmology/cosmological-lookback-time-local-increment",
      title: "Cosmological Lookback Time Local Increment Tool",
      description:
        "Local differential dtLookback=dz/[(1+z)*H(z)], rather than a finite-redshift integration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          redshift: { type: "number", exclusiveMinimum: -1 },
          redshiftIncrement: { type: "number" },
          hubbleAtRedshift: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["redshift", "redshiftIncrement", "hubbleAtRedshift"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { lookbackIncrement: { type: "number" } },
        required: ["lookbackIncrement"],
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
            id: "redshiftIncrement",
            label: "Redshift Increment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "hubbleAtRedshift",
            label: "Hubble At Redshift",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "lookbackIncrement",
            label: "Lookback Increment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cosmologicalLookbackTimeLocalIncrementTool.execute;
export default cosmologicalLookbackTimeLocalIncrementTool;
