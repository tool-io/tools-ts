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
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedLitterWetMassKg: readonly number[];
  readonly observedLitterDryMassFractions: readonly number[];
  readonly observedSampleAreasM2: readonly number[];
  readonly callerLitterOnlySampleVerified: boolean;
}>;
export type Output = Readonly<{ readonly observedLitterDryKgM2: number }>;
const inputFields = [
  {
    id: "observedLitterWetMassKg",
    label: "Observed litter wet mass kg",
    kind: "numberList",
  },
  {
    id: "observedLitterDryMassFractions",
    label: "Observed litter dry mass fractions",
    kind: "numberList",
  },
  {
    id: "observedSampleAreasM2",
    label: "Observed sample areas m2",
    kind: "numberList",
  },
  {
    id: "callerLitterOnlySampleVerified",
    label: "Caller litter only sample verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSampleAreasM2.forEach((v) =>
    positive(v, "observedSampleAreasM2"),
  );
  input.observedLitterWetMassKg.forEach((v) =>
    nonnegative(v, "observedLitterWetMassKg"),
  );
  input.observedLitterDryMassFractions.forEach((v) =>
    fraction(v, "observedLitterDryMassFractions"),
  );
  aligned(
    input.observedLitterWetMassKg,
    input.observedLitterDryMassFractions,
    "observedLitterWetMassKg",
  );
  aligned(
    input.observedLitterWetMassKg,
    input.observedSampleAreasM2,
    "observedLitterWetMassKg",
  );
  if (!input.callerLitterOnlySampleVerified)
    simpleError(
      "layer",
      "Independently isolated litter-only samples required, not whole forest floor.",
    );
  return {
    observedLitterDryKgM2:
      sum(
        input.observedLitterWetMassKg.map(
          (v, i) => v * input.observedLitterDryMassFractions[i],
        ),
      ) / sum(input.observedSampleAreasM2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLitterWetMassKg: [2, 3],
  observedLitterDryMassFractions: [0.5, 0.5],
  observedSampleAreasM2: [1, 2],
  callerLitterOnlySampleVerified: true,
} satisfies Input;
export const exampleOutput = {
  observedLitterDryKgM2: 0.8333333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/litter-biomass",
  title: "Litter Biomass Calculator",
  description:
    "Pool actual litter-only wet masses with independently measured dry fractions/core areas, unlike ash-free entire forest-floor biomass. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLitterDryKgM2",
      label: "Observed litter dry kg m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLitterWetMassKg:
        value.observedLitterWetMassKg as readonly number[],
      observedLitterDryMassFractions:
        value.observedLitterDryMassFractions as readonly number[],
      observedSampleAreasM2: value.observedSampleAreasM2 as readonly number[],
      callerLitterOnlySampleVerified:
        value.callerLitterOnlySampleVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
