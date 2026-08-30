import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly observedLayersPerSection: readonly number[];
  readonly estimatedMissingAnnualLayers: readonly number[];
  readonly estimatedDuplicateSubannualLayers: readonly number[];
  readonly oldestBoundaryCalendarYear: number;
}>;
export type Output = Readonly<{
  readonly correctedYearsPerSection: readonly number[];
  readonly representedChronologyYears: number;
  readonly youngestBoundaryCalendarYear: number;
}>;
const inputFields = [
  {
    id: "observedLayersPerSection",
    label: "Observed layers per section",
    kind: "numberList",
  },
  {
    id: "estimatedMissingAnnualLayers",
    label: "Estimated missing annual layers",
    kind: "numberList",
  },
  {
    id: "estimatedDuplicateSubannualLayers",
    label: "Estimated duplicate subannual layers",
    kind: "numberList",
  },
  {
    id: "oldestBoundaryCalendarYear",
    label: "Oldest boundary calendar year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLayersPerSection.forEach((v) =>
    count(v, "observedLayersPerSection"),
  );
  input.estimatedMissingAnnualLayers.forEach((v) =>
    count(v, "estimatedMissingAnnualLayers"),
  );
  input.estimatedDuplicateSubannualLayers.forEach((v) =>
    count(v, "estimatedDuplicateSubannualLayers"),
  );
  aligned(
    input.observedLayersPerSection,
    input.estimatedMissingAnnualLayers,
    "observedLayersPerSection",
  );
  aligned(
    input.observedLayersPerSection,
    input.estimatedDuplicateSubannualLayers,
    "observedLayersPerSection",
  );
  const correctedYearsPerSection = input.observedLayersPerSection.map((v, i) =>
      count(
        v +
          input.estimatedMissingAnnualLayers[i] -
          input.estimatedDuplicateSubannualLayers[i],
        "correctedYears",
      ),
    ),
    representedChronologyYears = correctedYearsPerSection.reduce(
      (a, b) => a + b,
      0,
    );
  return {
    correctedYearsPerSection,
    representedChronologyYears,
    youngestBoundaryCalendarYear:
      input.oldestBoundaryCalendarYear + representedChronologyYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLayersPerSection: [10, 20],
  estimatedMissingAnnualLayers: [1, 2],
  estimatedDuplicateSubannualLayers: [0, 3],
  oldestBoundaryCalendarYear: 1900,
} satisfies Input;
export const exampleOutput = {
  correctedYearsPerSection: [11, 19],
  representedChronologyYears: 30,
  youngestBoundaryCalendarYear: 1930,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/varve-layer-count",
  title: "Varve Layer Chronology Counter",
  description:
    "Count varve years on nonoverlapping sections with explicit missing/duplicate annual-layer assumptions and a supplied calendar boundary; laminae are not automatically annual.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctedYearsPerSection",
      label: "Corrected years per section",
      kind: "numberList",
    },
    {
      id: "representedChronologyYears",
      label: "Represented chronology years",
      kind: "number",
    },
    {
      id: "youngestBoundaryCalendarYear",
      label: "Youngest boundary calendar year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLayersPerSection:
        value.observedLayersPerSection as readonly number[],
      estimatedMissingAnnualLayers:
        value.estimatedMissingAnnualLayers as readonly number[],
      estimatedDuplicateSubannualLayers:
        value.estimatedDuplicateSubannualLayers as readonly number[],
      oldestBoundaryCalendarYear: value.oldestBoundaryCalendarYear as number,
    }),
});
export const run = tool.execute;
export default tool;
