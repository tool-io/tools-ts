import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredAnimalMassKg: number;
  readonly callerVeterinarianIndependentlyAssessedDehydrationPercent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredAnimalMassKg",
    label: "Independently measured animal mass kg",
    kind: "number",
  },
  {
    id: "callerVeterinarianIndependentlyAssessedDehydrationPercent",
    label: "Caller veterinarian independently assessed dehydration percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredAnimalMassKg, "mass");
  if (
    input.callerVeterinarianIndependentlyAssessedDehydrationPercent < 0 ||
    input.callerVeterinarianIndependentlyAssessedDehydrationPercent > 100
  )
    simpleError("percent", "Independently clinically assessed percent0–100.");
  return {
    conditionalDeficitReferenceMl:
      input.independentlyMeasuredAnimalMassKg *
      input.callerVeterinarianIndependentlyAssessedDehydrationPercent *
      10,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredAnimalMassKg: 10,
    callerVeterinarianIndependentlyAssessedDehydrationPercent: 5,
  },
  output: { result: { conditionalDeficitReferenceMl: 500 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/fluid-deficit-percent-dehydration",
  title: "Fluid Deficit From Dehydration Percent Calculator",
  description:
    "Conditional reference deficit mL=kg\u00d7assessedpercent\u00d710under declared water-density/bodymass convention. Dehydration assessment external, not estimate from symptoms or prescribe deficit replacement, rate or fluid type.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
