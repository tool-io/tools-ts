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
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSawlogSectionLengthsM: readonly number[];
  readonly observedRotAffectedLengthsM: readonly number[];
  readonly observedSectionAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly lengthBasedCullFraction: number;
  readonly areaWeightedRotVolumeProxyFraction: number;
}>;
const inputFields = [
  {
    id: "observedSawlogSectionLengthsM",
    label: "Observed sawlog section lengths m",
    kind: "numberList",
  },
  {
    id: "observedRotAffectedLengthsM",
    label: "Observed rot affected lengths m",
    kind: "numberList",
  },
  {
    id: "observedSectionAreasM2",
    label: "Observed section areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSawlogSectionLengthsM.forEach((v) =>
    positive(v, "observedSawlogSectionLengthsM"),
  );
  input.observedSectionAreasM2.forEach((v) =>
    positive(v, "observedSectionAreasM2"),
  );
  input.observedRotAffectedLengthsM.forEach((v) =>
    nonnegative(v, "observedRotAffectedLengthsM"),
  );
  aligned(
    input.observedSawlogSectionLengthsM,
    input.observedRotAffectedLengthsM,
    "observedSawlogSectionLengthsM",
  );
  aligned(
    input.observedSawlogSectionLengthsM,
    input.observedSectionAreasM2,
    "observedSawlogSectionLengthsM",
  );
  input.observedRotAffectedLengthsM.forEach((v, i) => {
    if (v > input.observedSawlogSectionLengthsM[i])
      simpleError("rot", "Affected length≤section length.");
  });
  return {
    lengthBasedCullFraction:
      sum(input.observedRotAffectedLengthsM) /
      sum(input.observedSawlogSectionLengthsM),
    areaWeightedRotVolumeProxyFraction:
      sum(
        input.observedRotAffectedLengthsM.map(
          (v, i) => v * input.observedSectionAreasM2[i],
        ),
      ) /
      sum(
        input.observedSawlogSectionLengthsM.map(
          (v, i) => v * input.observedSectionAreasM2[i],
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSawlogSectionLengthsM: [2, 3],
  observedRotAffectedLengthsM: [1, 1],
  observedSectionAreasM2: [1, 2],
} satisfies Input;
export const exampleOutput = {
  lengthBasedCullFraction: 0.4,
  areaWeightedRotVolumeProxyFraction: 0.375,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/cull-percent-rot-length-ratio-sawlog-sections",
  title: "Cull Percent From Rot Length Sawlog Sections",
  description:
    "Compare actual rot-length cull convention with independent section-area volume proxy, not whole-section generic defect deductions; affected length is not all wood physically decayed. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "lengthBasedCullFraction",
      label: "Length based cull fraction",
      kind: "number",
    },
    {
      id: "areaWeightedRotVolumeProxyFraction",
      label: "Area weighted rot volume proxy fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSawlogSectionLengthsM:
        value.observedSawlogSectionLengthsM as readonly number[],
      observedRotAffectedLengthsM:
        value.observedRotAffectedLengthsM as readonly number[],
      observedSectionAreasM2: value.observedSectionAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
