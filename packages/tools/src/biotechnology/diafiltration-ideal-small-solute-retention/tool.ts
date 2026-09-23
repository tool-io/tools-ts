import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diavolumes: number;
  readonly sievingCoefficient: number;
};
export type Output = { readonly remainingFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diavolumes: { type: "number", minimum: 0 },
    sievingCoefficient: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["diavolumes", "sievingCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingFraction: { type: "number" } },
  required: ["remainingFraction"],
} as const;
/** Use an ideal well-mixed constant-volume diafiltration exponential with an explicitly supplied sieving coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diavolumes, sievingCoefficient } = request;
  const compute = (): Output => {
    H.domain(diavolumes >= 0);
    H.probability(sievingCoefficient);
    return { remainingFraction: Math.exp(-sievingCoefficient * diavolumes) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diavolumes: 2, sievingCoefficient: 1 },
  output: { remainingFraction: 0.1353352832366127 },
} satisfies ToolExample<Input, Output>;
export const diafiltrationIdealSmallSoluteRetentionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biotechnology/diafiltration-ideal-small-solute-retention",
      title: "Diafiltration Ideal Small Solute Retention Tool",
      description:
        "Use an ideal well-mixed constant-volume diafiltration exponential with an explicitly supplied sieving coefficient.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          diavolumes: { type: "number", minimum: 0 },
          sievingCoefficient: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["diavolumes", "sievingCoefficient"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { remainingFraction: { type: "number" } },
        required: ["remainingFraction"],
      },
      ports: {
        inputs: [
          {
            id: "diavolumes",
            label: "Diavolumes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sievingCoefficient",
            label: "Sieving Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingFraction",
            label: "Remaining Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = diafiltrationIdealSmallSoluteRetentionTool.execute;
export default diafiltrationIdealSmallSoluteRetentionTool;
