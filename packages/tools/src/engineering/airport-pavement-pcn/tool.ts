import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  ordered,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedPavementPcnDemand: readonly number[];
  readonly callerVerifiedPavementPcnDemandLower: readonly number[];
  readonly callerVerifiedPavementPcnDemandUpper: readonly number[];
  readonly knownPavementPcnDemandCriterionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownBandMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriterionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPavementPcnDemand",
    label: "Observed pavement pcn demand",
    kind: "numberList",
  },
  {
    id: "callerVerifiedPavementPcnDemandLower",
    label: "Caller verified pavement pcn demand lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedPavementPcnDemandUpper",
    label: "Caller verified pavement pcn demand upper",
    kind: "numberList",
  },
  {
    id: "knownPavementPcnDemandCriterionFlags",
    label: "Known pavement pcn demand criterion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownPavementPcnDemandCriterionFlags,
    "knownPavementPcnDemandCriterionFlags",
  );
  aligned(
    input.observedPavementPcnDemand,
    input.callerVerifiedPavementPcnDemandLower,
    "observedPavementPcnDemand",
  );
  aligned(
    input.observedPavementPcnDemand,
    input.callerVerifiedPavementPcnDemandUpper,
    "observedPavementPcnDemand",
  );
  aligned(
    input.observedPavementPcnDemand,
    input.knownPavementPcnDemandCriterionFlags,
    "observedPavementPcnDemand",
  );
  input.callerVerifiedPavementPcnDemandLower.forEach((v, i) =>
    ordered(v, input.callerVerifiedPavementPcnDemandUpper[i]),
  );
  return {
    signedKnownBandMargins: input.observedPavementPcnDemand.map((v, i) =>
      input.knownPavementPcnDemandCriterionFlags[i]
        ? Math.min(
            v - input.callerVerifiedPavementPcnDemandLower[i],
            input.callerVerifiedPavementPcnDemandUpper[i] - v,
          )
        : 0,
    ),
    knownReviewIndices: input.observedPavementPcnDemand.flatMap((v, i) =>
      input.knownPavementPcnDemandCriterionFlags[i] &&
      (v < input.callerVerifiedPavementPcnDemandLower[i] ||
        v > input.callerVerifiedPavementPcnDemandUpper[i])
        ? [i]
        : [],
    ),
    unknownCriterionIndices: input.knownPavementPcnDemandCriterionFlags.flatMap(
      (v, i) => (!v ? [i] : []),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPavementPcnDemand: [2, 5],
  callerVerifiedPavementPcnDemandLower: [1, 1],
  callerVerifiedPavementPcnDemandUpper: [3, 4],
  knownPavementPcnDemandCriterionFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedKnownBandMargins: [1, 0],
  knownReviewIndices: [],
  unknownCriterionIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/airport-pavement-pcn",
  title: "Airport Pavement PCN Calculator",
  description:
    "Audit independently established aircraft pavement demand against exact pavement-type/subgrade/pressure-method capacity bands, no PCN from layer thickness or runway authorization. Unknown criterion indices distinguish zero placeholders from known zero margins. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedKnownBandMargins",
      label: "Signed known band margins",
      kind: "numberList",
    },
    {
      id: "knownReviewIndices",
      label: "Known review indices",
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
      observedPavementPcnDemand:
        value.observedPavementPcnDemand as readonly number[],
      callerVerifiedPavementPcnDemandLower:
        value.callerVerifiedPavementPcnDemandLower as readonly number[],
      callerVerifiedPavementPcnDemandUpper:
        value.callerVerifiedPavementPcnDemandUpper as readonly number[],
      knownPavementPcnDemandCriterionFlags:
        value.knownPavementPcnDemandCriterionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
