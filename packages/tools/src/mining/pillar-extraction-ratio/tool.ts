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
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedOriginalPillarAreasM2: readonly number[];
  readonly observedExtractedPillarAreasM2: readonly number[];
  readonly knownPillarExtractionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownObservedPillarExtractionFraction: number;
  readonly unassessedOriginalPillarAreaM2: number;
}>;
const inputFields = [
  {
    id: "observedOriginalPillarAreasM2",
    label: "Observed original pillar areas m2",
    kind: "numberList",
  },
  {
    id: "observedExtractedPillarAreasM2",
    label: "Observed extracted pillar areas m2",
    kind: "numberList",
  },
  {
    id: "knownPillarExtractionFlags",
    label: "Known pillar extraction flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOriginalPillarAreasM2.forEach((v) =>
    positive(v, "observedOriginalPillarAreasM2"),
  );
  input.observedExtractedPillarAreasM2.forEach((v) =>
    nonnegative(v, "observedExtractedPillarAreasM2"),
  );
  binary(input.knownPillarExtractionFlags, "knownPillarExtractionFlags");
  aligned(
    input.observedOriginalPillarAreasM2,
    input.observedExtractedPillarAreasM2,
    "observedOriginalPillarAreasM2",
  );
  aligned(
    input.observedOriginalPillarAreasM2,
    input.knownPillarExtractionFlags,
    "observedOriginalPillarAreasM2",
  );
  input.observedExtractedPillarAreasM2.forEach((v, i) => {
    if (v > input.observedOriginalPillarAreasM2[i])
      simpleError("extraction", "Actual extraction≤original pillar area.");
  });
  const known = sum(
    input.observedOriginalPillarAreasM2.filter(
      (_, i) => input.knownPillarExtractionFlags[i],
    ),
  );
  positive(known, "known area");
  return {
    knownObservedPillarExtractionFraction:
      sum(
        input.observedExtractedPillarAreasM2.filter(
          (_, i) => input.knownPillarExtractionFlags[i],
        ),
      ) / known,
    unassessedOriginalPillarAreaM2: sum(
      input.observedOriginalPillarAreasM2.filter(
        (_, i) => !input.knownPillarExtractionFlags[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOriginalPillarAreasM2: [10, 20],
  observedExtractedPillarAreasM2: [2, 10],
  knownPillarExtractionFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownObservedPillarExtractionFraction: 0.2,
  unassessedOriginalPillarAreaM2: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/pillar-extraction-ratio",
  title: "Pillar Extraction Ratio Calculator",
  description:
    "Audit actual independently surveyed pillar extraction with missing assessment area, not repeating-cell room geometry or recommended secondary recovery. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownObservedPillarExtractionFraction",
      label: "Known observed pillar extraction fraction",
      kind: "number",
    },
    {
      id: "unassessedOriginalPillarAreaM2",
      label: "Unassessed original pillar area m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOriginalPillarAreasM2:
        value.observedOriginalPillarAreasM2 as readonly number[],
      observedExtractedPillarAreasM2:
        value.observedExtractedPillarAreasM2 as readonly number[],
      knownPillarExtractionFlags:
        value.knownPillarExtractionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
