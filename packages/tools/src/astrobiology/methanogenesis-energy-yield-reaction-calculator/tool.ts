import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedStandardGibbsKjPerMol: number;
  readonly temperatureKelvin: number;
  readonly callerVerifiedDimensionlessReactionQuotient: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedStandardGibbsKjPerMol",
    label: "Caller verified standard gibbs kj per mol",
    kind: "number",
  },
  { id: "temperatureKelvin", label: "Temperature kelvin", kind: "number" },
  {
    id: "callerVerifiedDimensionlessReactionQuotient",
    label: "Caller verified dimensionless reaction quotient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.temperatureKelvin, "temperature");
  positive(input.callerVerifiedDimensionlessReactionQuotient, "Q");
  return {
    conditionalReactionGibbsKjPerMol:
      input.callerVerifiedStandardGibbsKjPerMol +
      0.00831446261815324 *
        input.temperatureKelvin *
        Math.log(input.callerVerifiedDimensionlessReactionQuotient),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedStandardGibbsKjPerMol: -100,
    temperatureKelvin: 300,
    callerVerifiedDimensionlessReactionQuotient: 1,
  },
  output: { result: { conditionalReactionGibbsKjPerMol: -100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/methanogenesis-energy-yield-reaction-calculator",
  title: "Methanogenesis Energy Yield kJ per mole Reaction Calculator",
  description:
    "Conditional methanogenesis reaction Gibbs\u0394G=\u0394G\u00b0+RTlnQwith independently verified balanced reaction, activity convention and matched standard conditions. Not automatic energy available to organisms or kinetic viability.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
