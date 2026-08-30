import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  shape,
} from "../shared.js";
export type Input = Readonly<{
  readonly speciesPresenceByPlot: readonly (readonly number[])[];
  readonly plotAssessableFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly assessablePlotCount: number;
  readonly speciesOccurrencePercentages: readonly number[];
}>;
const inputFields = [
  {
    id: "speciesPresenceByPlot",
    label: "Species presence by plot",
    kind: "matrix",
  },
  {
    id: "plotAssessableFlags",
    label: "Plot assessable flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.plotAssessableFlags.forEach((v) => count(v, "plotAssessableFlags"));
  const m = shape(input.speciesPresenceByPlot, "speciesPresenceByPlot");
  aligned(input.speciesPresenceByPlot, input.plotAssessableFlags, "plots");
  if (
    input.plotAssessableFlags.some((v) => v !== 0 && v !== 1) ||
    input.speciesPresenceByPlot.some((row) =>
      row.some((v) => v !== 0 && v !== 1),
    )
  )
    simpleError(
      "presence",
      "Binary plot observability and taxon presence required.",
    );
  const assessablePlotCount = positive(
    input.plotAssessableFlags.reduce((a, b) => a + b, 0),
    "plots",
  );
  return {
    assessablePlotCount,
    speciesOccurrencePercentages: Array.from(
      { length: m },
      (_, j) =>
        (100 *
          input.speciesPresenceByPlot.reduce(
            (s, row, i) => s + row[j] * input.plotAssessableFlags[i],
            0,
          )) /
        assessablePlotCount,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  speciesPresenceByPlot: [
    [1, 0],
    [0, 1],
    [1, 1],
  ],
  plotAssessableFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  assessablePlotCount: 2,
  speciesOccurrencePercentages: [100, 50],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/frequency-plot-occurrence",
  title: "Plot Occurrence Frequency",
  description:
    "Tabulate observed taxon occurrence across assessable plots from a binary inventory; unassessable plots are excluded, not assumed absent, and occurrence is not stem density.",
  inputs: inputFields,
  outputs: [
    {
      id: "assessablePlotCount",
      label: "Assessable plot count",
      kind: "number",
    },
    {
      id: "speciesOccurrencePercentages",
      label: "Species occurrence percentages",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      speciesPresenceByPlot:
        value.speciesPresenceByPlot as readonly (readonly number[])[],
      plotAssessableFlags: value.plotAssessableFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
