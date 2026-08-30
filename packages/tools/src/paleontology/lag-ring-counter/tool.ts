import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, aligned, maximum } from "../shared.js";
export type Input = Readonly<{
  readonly observedLagBandCountsBySection: readonly number[];
  readonly estimatedResorbedInnerBands: readonly number[];
  readonly estimatedDoubleCountedBands: readonly number[];
}>;
export type Output = Readonly<{
  readonly sectionAnnualAgeScenarios: readonly number[];
  readonly minimumAgeScenarioYears: number;
}>;
const inputFields = [
  {
    id: "observedLagBandCountsBySection",
    label: "Observed lag band counts by section",
    kind: "numberList",
  },
  {
    id: "estimatedResorbedInnerBands",
    label: "Estimated resorbed inner bands",
    kind: "numberList",
  },
  {
    id: "estimatedDoubleCountedBands",
    label: "Estimated double counted bands",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLagBandCountsBySection.forEach((v) =>
    count(v, "observedLagBandCountsBySection"),
  );
  input.estimatedResorbedInnerBands.forEach((v) =>
    count(v, "estimatedResorbedInnerBands"),
  );
  input.estimatedDoubleCountedBands.forEach((v) =>
    count(v, "estimatedDoubleCountedBands"),
  );
  aligned(
    input.observedLagBandCountsBySection,
    input.estimatedResorbedInnerBands,
    "observedLagBandCountsBySection",
  );
  aligned(
    input.observedLagBandCountsBySection,
    input.estimatedDoubleCountedBands,
    "observedLagBandCountsBySection",
  );
  const sectionAnnualAgeScenarios = input.observedLagBandCountsBySection.map(
    (v, i) =>
      count(
        v +
          input.estimatedResorbedInnerBands[i] -
          input.estimatedDoubleCountedBands[i],
        "bands",
      ),
  );
  return {
    sectionAnnualAgeScenarios,
    minimumAgeScenarioYears: maximum(sectionAnnualAgeScenarios),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLagBandCountsBySection: [5, 7],
  estimatedResorbedInnerBands: [1, 2],
  estimatedDoubleCountedBands: [0, 1],
} satisfies Input;
export const exampleOutput = {
  sectionAnnualAgeScenarios: [6, 8],
  minimumAgeScenarioYears: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/lag-ring-counter",
  title: "Growth Ring Lines of Arrested Growth Counter",
  description:
    "Combine observed LAG counts with explicit resorption/double-band assumptions, taking the largest section-based minimum annual-age scenario; annual periodicity is an assumption, not automatically established skeletal age.",
  inputs: inputFields,
  outputs: [
    {
      id: "sectionAnnualAgeScenarios",
      label: "Section annual age scenarios",
      kind: "numberList",
    },
    {
      id: "minimumAgeScenarioYears",
      label: "Minimum age scenario years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLagBandCountsBySection:
        value.observedLagBandCountsBySection as readonly number[],
      estimatedResorbedInnerBands:
        value.estimatedResorbedInnerBands as readonly number[],
      estimatedDoubleCountedBands:
        value.estimatedDoubleCountedBands as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
