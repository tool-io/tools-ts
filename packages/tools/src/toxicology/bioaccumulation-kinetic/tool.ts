import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyFittedUptakeRate: number;
  readonly callerIndependentlyFittedDepurationRatePerDay: number;
  readonly actualAmbientConcentration: number;
  readonly actualInitialBiotaConcentration: number;
  readonly elapsedDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyFittedUptakeRate",
    label: "Caller independently fitted uptake rate",
    kind: "number",
  },
  {
    id: "callerIndependentlyFittedDepurationRatePerDay",
    label: "Caller independently fitted depuration rate per day",
    kind: "number",
  },
  {
    id: "actualAmbientConcentration",
    label: "Actual ambient concentration",
    kind: "number",
  },
  {
    id: "actualInitialBiotaConcentration",
    label: "Actual initial biota concentration",
    kind: "number",
  },
  { id: "elapsedDays", label: "Elapsed days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerIndependentlyFittedUptakeRate, "uptake");
  positive(input.callerIndependentlyFittedDepurationRatePerDay, "depuration");
  nonnegative(input.actualAmbientConcentration, "ambient");
  nonnegative(input.actualInitialBiotaConcentration, "initial");
  nonnegative(input.elapsedDays, "days");
  const s =
    (input.callerIndependentlyFittedUptakeRate *
      input.actualAmbientConcentration) /
    input.callerIndependentlyFittedDepurationRatePerDay;
  return {
    conditionalOneCompartmentBiotaConcentration:
      s +
      (input.actualInitialBiotaConcentration - s) *
        Math.exp(
          -input.callerIndependentlyFittedDepurationRatePerDay *
            input.elapsedDays,
        ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyFittedUptakeRate: 2,
    callerIndependentlyFittedDepurationRatePerDay: 1,
    actualAmbientConcentration: 3,
    actualInitialBiotaConcentration: 1,
    elapsedDays: 1,
  },
  output: {
    result: { conditionalOneCompartmentBiotaConcentration: 4.160602794142788 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/bioaccumulation-kinetic",
  title: "Bioaccumulation Kinetic Calculator",
  description:
    "Conditional actual biota uptake/depuration kinetics C(t)=k1Cwater/k2+(C0\u2212steady) exp(\u2212k2t), constant actual water concentration, no growth/diet input. Distinct from equilibrium BCFalone; externally fitted rates and population applicability required, no observed future concentration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
