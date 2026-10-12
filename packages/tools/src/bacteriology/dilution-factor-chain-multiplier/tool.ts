import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly stepDilutionDivisors: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "stepDilutionDivisors",
    label: "Step dilution divisors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  if (!i.stepDilutionDivisors.length || i.stepDilutionDivisors.length > 128)
    simpleError("steps", "1–128 actual nonuniform dilution steps.");
  i.stepDilutionDivisors.forEach((v) => {
    if (v < 1) simpleError("divisor", "Dilution divisors>=1.");
  });
  return {
    totalDilutionDivisor: i.stepDilutionDivisors.reduce((p, v) => p * v, 1),
    remainingConcentrationFraction: i.stepDilutionDivisors.reduce(
      (p, v) => p / v,
      1,
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { stepDilutionDivisors: [2, 5, 10] },
  output: {
    result: { totalDilutionDivisor: 100, remainingConcentrationFraction: 0.01 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/dilution-factor-chain-multiplier",
  title: "Dilution Factor Chain Product Multiplier Calculator",
  description:
    "Product of actual potentially unequal dilution divisors; unlike fixed-step power model, each actual transfer can differ; no pipetting uncertainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalDilutionDivisor: { type: "number" },
          remainingConcentrationFraction: { type: "number" },
        },
        required: ["totalDilutionDivisor", "remainingConcentrationFraction"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
