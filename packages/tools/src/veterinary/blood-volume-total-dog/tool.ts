import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredAnimalMassKg: number;
  readonly callerVeterinarianApplicableBloodVolumeMlPerKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredAnimalMassKg",
    label: "Independently measured animal mass kg",
    kind: "number",
  },
  {
    id: "callerVeterinarianApplicableBloodVolumeMlPerKg",
    label: "Caller veterinarian applicable blood volume ml per kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredAnimalMassKg, "mass");
  positive(
    input.callerVeterinarianApplicableBloodVolumeMlPerKg,
    "independent-coefficient",
  );
  return {
    conditionalCallerBloodVolumeMl:
      input.independentlyMeasuredAnimalMassKg *
      input.callerVeterinarianApplicableBloodVolumeMlPerKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredAnimalMassKg: 10,
    callerVeterinarianApplicableBloodVolumeMlPerKg: 80,
  },
  output: { result: { conditionalCallerBloodVolumeMl: 800 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/blood-volume-total-dog",
  title: "Total Dog Blood Volume Calculator",
  description:
    "Conditional dog blood-volume reference with explicit independently veterinarian applicable mL/kgcoefficient; not actual measured blood volume, universal species constant or transfusion eligibility.",
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
