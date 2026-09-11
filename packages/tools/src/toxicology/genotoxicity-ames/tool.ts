import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  bounded,
  strictlyIncreasing,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualTestedDoseCoordinates: readonly number[];
  readonly independentlyCountedRevertantColonies: readonly number[];
  readonly matchedControlRevertantCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTestedDoseCoordinates",
    label: "Actual tested dose coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyCountedRevertantColonies",
    label: "Independently counted revertant colonies",
    kind: "numberList",
  },
  {
    id: "matchedControlRevertantCount",
    label: "Matched control revertant count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualTestedDoseCoordinates,
    input.independentlyCountedRevertantColonies,
    "doses",
  );
  strictlyIncreasing(input.actualTestedDoseCoordinates, "doses", 2);
  input.independentlyCountedRevertantColonies.forEach((v) =>
    bounded(v, "colonies", 0, 10000000),
  );
  bounded(input.matchedControlRevertantCount, "control", 1, 10000000);
  return {
    observedRevertantFoldChanges:
      input.independentlyCountedRevertantColonies.map(
        (v) => v / input.matchedControlRevertantCount,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTestedDoseCoordinates: [1, 2, 3],
    independentlyCountedRevertantColonies: [10, 20, 30],
    matchedControlRevertantCount: 10,
  },
  output: { result: { observedRevertantFoldChanges: [1, 2, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/genotoxicity-ames",
  title: "Ames Genotoxicity Calculator",
  description:
    "Actual strain/activation/protocol-specific Amesobserved revertant fold changes. Counts, control adequacy, dose response, replicates, cytotoxicity and assay interpretation external; not diagnose genotoxicity or prescribe experimental procedures.",
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
