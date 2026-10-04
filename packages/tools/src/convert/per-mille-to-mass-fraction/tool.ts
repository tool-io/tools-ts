import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly perMille: number };
export type Output = { readonly massFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { perMille: { type: "number", minimum: 0 } },
  required: ["perMille"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massFraction: { type: "number" } },
  required: ["massFraction"],
} as const;
/** Convert a mass fraction expressed per thousand into kg/kg. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { perMille } = request;
  const compute = (): Output => {
    H.domain(perMille >= 0 && perMille <= 1000, "perMille");
    return { massFraction: perMille / 1000 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { perMille: 25 },
  output: { massFraction: 0.025 },
} satisfies ToolExample<Input, Output>;
export const perMilleToMassFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/per-mille-to-mass-fraction",
    title: "Per Mille To Mass Fraction Tool",
    description: "Convert a mass fraction expressed per thousand into kg/kg.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { perMille: { type: "number", minimum: 0 } },
      required: ["perMille"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { massFraction: { type: "number" } },
      required: ["massFraction"],
    },
    ports: {
      inputs: [
        {
          id: "perMille",
          label: "Per Mille",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massFraction",
          label: "Mass Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = perMilleToMassFractionTool.execute;
export default perMilleToMassFractionTool;
