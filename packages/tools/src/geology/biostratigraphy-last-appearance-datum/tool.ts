import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  binary,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualObservedOccurrenceHeightsMeters: readonly number[];
  readonly occurrenceEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedOccurrenceHeightsMeters",
    label: "Actual observed occurrence heights meters",
    kind: "numberList",
  },
  {
    id: "occurrenceEvidenceKnownFlags",
    label: "Occurrence evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualObservedOccurrenceHeightsMeters,
    input.occurrenceEvidenceKnownFlags,
    "occurrences",
  );
  binary(input.occurrenceEvidenceKnownFlags, "known");
  if (!input.occurrenceEvidenceKnownFlags.includes(1))
    simpleError(
      "occurrences",
      "At least one actual independently identified occurrence.",
    );
  return {
    highestKnownLastAppearanceHeightMeters: Math.max(
      ...input.actualObservedOccurrenceHeightsMeters.filter(
        (_, i) => input.occurrenceEvidenceKnownFlags[i],
      ),
    ),
    unknownOccurrenceIndices: input.occurrenceEvidenceKnownFlags.flatMap(
      (v, i) => (v ? [] : [i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualObservedOccurrenceHeightsMeters: [3, 1, 5],
    occurrenceEvidenceKnownFlags: [1, 1, 0],
  },
  output: {
    result: {
      highestKnownLastAppearanceHeightMeters: 3,
      unknownOccurrenceIndices: [2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/biostratigraphy-last-appearance-datum",
  title: "Geology Biostratigraphy Last Appearance Datum Calculator",
  description:
    "Actual section-positive-up known last fossil occurrence height, unknowns retained. Sampling incompleteness, reworking, erosion, stratigraphic direction and chronological interpretation external; not true extinction age.",
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
