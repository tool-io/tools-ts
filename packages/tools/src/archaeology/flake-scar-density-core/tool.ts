import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedCoreScarCounts: readonly number[];
  readonly observedSameCoreExposedAreasCM2: readonly number[];
}>;
export type Output = Readonly<{ readonly pooledObservedScarsPerCM2: number }>;
const inputFields = [
  {
    id: "observedCoreScarCounts",
    label: "Observed core scar counts",
    kind: "numberList",
  },
  {
    id: "observedSameCoreExposedAreasCM2",
    label: "Observed same core exposed areas c m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSameCoreExposedAreasCM2.forEach((v) =>
    positive(v, "observedSameCoreExposedAreasCM2"),
  );
  input.observedCoreScarCounts.forEach((v) =>
    nonnegative(v, "observedCoreScarCounts"),
  );
  aligned(
    input.observedCoreScarCounts,
    input.observedSameCoreExposedAreasCM2,
    "observedCoreScarCounts",
  );
  input.observedCoreScarCounts.forEach((v) => integer(v, "scars"));
  return {
    pooledObservedScarsPerCM2:
      sum(input.observedCoreScarCounts) /
      sum(input.observedSameCoreExposedAreasCM2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCoreScarCounts: [4, 6],
  observedSameCoreExposedAreasCM2: [2, 3],
} satisfies Input;
export const exampleOutput = { pooledObservedScarsPerCM2: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/flake-scar-density-core",
  title: "Flake Scar Density Core Calculator",
  description:
    "Pooled independently identified lithic scar count per actually examined core area, not retouch width/microblade index or stage classification. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledObservedScarsPerCM2",
      label: "Pooled observed scars per c m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCoreScarCounts: value.observedCoreScarCounts as readonly number[],
      observedSameCoreExposedAreasCM2:
        value.observedSameCoreExposedAreasCM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
