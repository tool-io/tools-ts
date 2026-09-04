import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  aligned,
  binary,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSoilMoistureFractions: readonly number[];
  readonly callerMatchedMoistureLimitFractions: readonly number[];
  readonly knownLocalCriterionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownMoistureLimitExceedanceIndices: readonly number[];
  readonly unknownCriterionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSoilMoistureFractions",
    label: "Observed soil moisture fractions",
    kind: "numberList",
  },
  {
    id: "callerMatchedMoistureLimitFractions",
    label: "Caller matched moisture limit fractions",
    kind: "numberList",
  },
  {
    id: "knownLocalCriterionFlags",
    label: "Known local criterion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSoilMoistureFractions.forEach((v) =>
    fraction(v, "observedSoilMoistureFractions"),
  );
  input.callerMatchedMoistureLimitFractions.forEach((v) =>
    fraction(v, "callerMatchedMoistureLimitFractions"),
  );
  binary(input.knownLocalCriterionFlags, "knownLocalCriterionFlags");
  aligned(
    input.observedSoilMoistureFractions,
    input.callerMatchedMoistureLimitFractions,
    "observedSoilMoistureFractions",
  );
  aligned(
    input.observedSoilMoistureFractions,
    input.knownLocalCriterionFlags,
    "observedSoilMoistureFractions",
  );
  return {
    knownMoistureLimitExceedanceIndices:
      input.observedSoilMoistureFractions.flatMap((v, i) =>
        input.knownLocalCriterionFlags[i] &&
        v > input.callerMatchedMoistureLimitFractions[i]
          ? [i]
          : [],
      ),
    unknownCriterionIndices: input.knownLocalCriterionFlags.flatMap((v, i) =>
      !v ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSoilMoistureFractions: [0.2, 0.4],
  callerMatchedMoistureLimitFractions: [0.3, 0.3],
  knownLocalCriterionFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownMoistureLimitExceedanceIndices: [],
  unknownCriterionIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/coarse-fragile-soil-trafficability-moisture-checker",
  title: "Soil Trafficability Moisture Checker",
  description:
    "Audit measured soil moisture against independently matched texture/soil local criterion, unknown criteria retained; no trafficability or safe machine access determination. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownMoistureLimitExceedanceIndices",
      label: "Known moisture limit exceedance indices",
      kind: "numberList",
    },
    {
      id: "unknownCriterionIndices",
      label: "Unknown criterion indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSoilMoistureFractions:
        value.observedSoilMoistureFractions as readonly number[],
      callerMatchedMoistureLimitFractions:
        value.callerMatchedMoistureLimitFractions as readonly number[],
      knownLocalCriterionFlags:
        value.knownLocalCriterionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
