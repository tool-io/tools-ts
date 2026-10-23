import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, kleiber } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredAnimalMassKg: number;
  readonly callerVeterinarianApplicableMaintenanceMultiplier: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyMeasuredAnimalMassKg",
    label: "Independently measured animal mass kg",
    kind: "number",
  },
  {
    id: "callerVeterinarianApplicableMaintenanceMultiplier",
    label: "Caller veterinarian applicable maintenance multiplier",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.independentlyMeasuredAnimalMassKg, "mass");
  positive(
    input.callerVeterinarianApplicableMaintenanceMultiplier,
    "multiplier",
  );
  const r = kleiber({
    bodyMassKg: input.independentlyMeasuredAnimalMassKg,
  }).basalMetabolicRateKcal;
  return {
    conditionalReferenceRerKcalPerDay: r,
    conditionalCallerMerKcalPerDay:
      r * input.callerVeterinarianApplicableMaintenanceMultiplier,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredAnimalMassKg: 16,
    callerVeterinarianApplicableMaintenanceMultiplier: 1.5,
  },
  output: {
    result: {
      conditionalReferenceRerKcalPerDay: 560,
      conditionalCallerMerKcalPerDay: 840,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/mer-maintenance-energy-requirement-dog",
  title: "Dog MER Calculator",
  description:
    "Conditional dog maintenance scenario composing existing Kleiber70mass^0.75reference and explicitly independently veterinarian applicable multiplier. Not measured energy expenditure or individual feeding prescription; growth, body condition, disease, neutering/activity and uncertainty external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditionalReferenceRerKcalPerDay: { type: "number" },
          conditionalCallerMerKcalPerDay: { type: "number" },
        },
        required: [
          "conditionalReferenceRerKcalPerDay",
          "conditionalCallerMerKcalPerDay",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
