import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  aligned,
  binary,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedEruptionEventCounts: readonly number[];
  readonly callerCompletenessVerifiedExposureYears: readonly number[];
  readonly knownCatalogCompletenessFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly completenessQualifiedEruptionsPerCentury: number;
  readonly unqualifiedCatalogExposureYears: number;
}>;
const inputFields = [
  {
    id: "observedEruptionEventCounts",
    label: "Observed eruption event counts",
    kind: "numberList",
  },
  {
    id: "callerCompletenessVerifiedExposureYears",
    label: "Caller completeness verified exposure years",
    kind: "numberList",
  },
  {
    id: "knownCatalogCompletenessFlags",
    label: "Known catalog completeness flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerCompletenessVerifiedExposureYears.forEach((v) =>
    positive(v, "callerCompletenessVerifiedExposureYears"),
  );
  input.observedEruptionEventCounts.forEach((v) =>
    nonnegative(v, "observedEruptionEventCounts"),
  );
  binary(input.knownCatalogCompletenessFlags, "knownCatalogCompletenessFlags");
  aligned(
    input.observedEruptionEventCounts,
    input.callerCompletenessVerifiedExposureYears,
    "observedEruptionEventCounts",
  );
  aligned(
    input.observedEruptionEventCounts,
    input.knownCatalogCompletenessFlags,
    "observedEruptionEventCounts",
  );
  input.observedEruptionEventCounts.forEach((v) => integer(v, "events"));
  const time = sum(
    input.callerCompletenessVerifiedExposureYears.filter(
      (_, i) => input.knownCatalogCompletenessFlags[i],
    ),
  );
  positive(time, "qualified catalog exposure");
  return {
    completenessQualifiedEruptionsPerCentury:
      (100 *
        sum(
          input.observedEruptionEventCounts.filter(
            (_, i) => input.knownCatalogCompletenessFlags[i],
          ),
        )) /
      time,
    unqualifiedCatalogExposureYears: sum(
      input.callerCompletenessVerifiedExposureYears.filter(
        (_, i) => !input.knownCatalogCompletenessFlags[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEruptionEventCounts: [2, 3],
  callerCompletenessVerifiedExposureYears: [10, 40],
  knownCatalogCompletenessFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  completenessQualifiedEruptionsPerCentury: 20,
  unqualifiedCatalogExposureYears: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/historical-eruption-frequency-per-century",
  title: "Historical Eruption Frequency Per Century Calculator",
  description:
    "Historical qualified catalog event/exposure rate, unqualified windows reported not silently pooled, no Poisson recurrence probability or next eruption prediction. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "completenessQualifiedEruptionsPerCentury",
      label: "Completeness qualified eruptions per century",
      kind: "number",
    },
    {
      id: "unqualifiedCatalogExposureYears",
      label: "Unqualified catalog exposure years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEruptionEventCounts:
        value.observedEruptionEventCounts as readonly number[],
      callerCompletenessVerifiedExposureYears:
        value.callerCompletenessVerifiedExposureYears as readonly number[],
      knownCatalogCompletenessFlags:
        value.knownCatalogCompletenessFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
