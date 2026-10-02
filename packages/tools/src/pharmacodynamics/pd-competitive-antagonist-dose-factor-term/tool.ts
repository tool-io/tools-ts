import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly antagonist: number;
  readonly inhibitionConstant: number;
  readonly agonistEc50: number;
};
export type Output = {
  readonly doseRatio: number;
  readonly shiftedEc50: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    antagonist: { type: "number", minimum: 0 },
    inhibitionConstant: { type: "number", exclusiveMinimum: 0 },
    agonistEc50: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["antagonist", "inhibitionConstant", "agonistEc50"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    doseRatio: { type: "number" },
    shiftedEc50: { type: "number" },
  },
  required: ["doseRatio", "shiftedEc50"],
} as const;
/** Formal competitive model shift with supplied equilibrium parameters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { antagonist, inhibitionConstant, agonistEc50 } = request;
  const compute = (): Output => {
    H.domain(antagonist >= 0);
    H.positive(inhibitionConstant);
    H.positive(agonistEc50);
    return {
      doseRatio: 1 + antagonist / inhibitionConstant,
      shiftedEc50: agonistEc50 * (1 + antagonist / inhibitionConstant),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { antagonist: 2, inhibitionConstant: 1, agonistEc50: 4 },
  output: { doseRatio: 3, shiftedEc50: 12 },
} satisfies ToolExample<Input, Output>;
export const pdCompetitiveAntagonistDoseFactorTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacodynamics/pd-competitive-antagonist-dose-factor-term",
      title: "PD Competitive Antagonist Dose Factor Term Tool",
      description:
        "Formal competitive model shift with supplied equilibrium parameters.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          antagonist: { type: "number", minimum: 0 },
          inhibitionConstant: { type: "number", exclusiveMinimum: 0 },
          agonistEc50: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["antagonist", "inhibitionConstant", "agonistEc50"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          doseRatio: { type: "number" },
          shiftedEc50: { type: "number" },
        },
        required: ["doseRatio", "shiftedEc50"],
      },
      ports: {
        inputs: [
          {
            id: "antagonist",
            label: "Antagonist",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inhibitionConstant",
            label: "Inhibition Constant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "agonistEc50",
            label: "Agonist Ec50",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "doseRatio",
            label: "Dose Ratio",
            valueType: { type: "number" },
          },
          {
            id: "shiftedEc50",
            label: "Shifted Ec50",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pdCompetitiveAntagonistDoseFactorTermTool.execute;
export default pdCompetitiveAntagonistDoseFactorTermTool;
