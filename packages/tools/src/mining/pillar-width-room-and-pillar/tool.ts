import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedPillarCellPitchesM: readonly number[];
  readonly observedMatchedRoomWidthsM: readonly number[];
  readonly observedIndependentPillarWidthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly cellResidualEquivalentPillarWidthsM: readonly number[];
  readonly signedSurveyPillarDiscrepanciesM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPillarCellPitchesM",
    label: "Observed pillar cell pitches m",
    kind: "numberList",
  },
  {
    id: "observedMatchedRoomWidthsM",
    label: "Observed matched room widths m",
    kind: "numberList",
  },
  {
    id: "observedIndependentPillarWidthsM",
    label: "Observed independent pillar widths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPillarCellPitchesM.forEach((v) =>
    positive(v, "observedPillarCellPitchesM"),
  );
  input.observedMatchedRoomWidthsM.forEach((v) =>
    nonnegative(v, "observedMatchedRoomWidthsM"),
  );
  input.observedIndependentPillarWidthsM.forEach((v) =>
    nonnegative(v, "observedIndependentPillarWidthsM"),
  );
  aligned(
    input.observedPillarCellPitchesM,
    input.observedMatchedRoomWidthsM,
    "observedPillarCellPitchesM",
  );
  aligned(
    input.observedPillarCellPitchesM,
    input.observedIndependentPillarWidthsM,
    "observedPillarCellPitchesM",
  );
  const pillar = input.observedPillarCellPitchesM.map((v, i) => {
    const p = v - input.observedMatchedRoomWidthsM[i];
    nonnegative(p, "cell residual");
    return p;
  });
  return {
    cellResidualEquivalentPillarWidthsM: pillar,
    signedSurveyPillarDiscrepanciesM: pillar.map(
      (v, i) => input.observedIndependentPillarWidthsM[i] - v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPillarCellPitchesM: [5, 8],
  observedMatchedRoomWidthsM: [2, 3],
  observedIndependentPillarWidthsM: [3, 4],
} satisfies Input;
export const exampleOutput = {
  cellResidualEquivalentPillarWidthsM: [3, 5],
  signedSurveyPillarDiscrepanciesM: [0, -1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/pillar-width-room-and-pillar",
  title: "Room and Pillar Width Calculator",
  description:
    "Reconcile measured repeating-cell pitch/room residual versus independent pillar width survey, not target extraction ratio inverse or pillar support design. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "cellResidualEquivalentPillarWidthsM",
      label: "Cell residual equivalent pillar widths m",
      kind: "numberList",
    },
    {
      id: "signedSurveyPillarDiscrepanciesM",
      label: "Signed survey pillar discrepancies m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPillarCellPitchesM:
        value.observedPillarCellPitchesM as readonly number[],
      observedMatchedRoomWidthsM:
        value.observedMatchedRoomWidthsM as readonly number[],
      observedIndependentPillarWidthsM:
        value.observedIndependentPillarWidthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
