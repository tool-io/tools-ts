import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sequence,
  modulo,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly initialFacingNeswCode: number;
  readonly callerSignedQuarterTurns: readonly number[];
}>;
export type Output = Readonly<{
  readonly facingNeswCodesAfterTurns: readonly number[];
  readonly signedCumulativeQuarterTurns: readonly number[];
  readonly observedFinalFacingNeswCode: number;
}>;
const inputFields = [
  {
    id: "initialFacingNeswCode",
    label: "Initial facing nesw code",
    kind: "number",
  },
  {
    id: "callerSignedQuarterTurns",
    label: "Caller signed quarter turns",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.initialFacingNeswCode, "facing", 0, 3);
  if (!input.callerSignedQuarterTurns.length)
    simpleError("turns", "Actual quarter-turn sequence required.");
  input.callerSignedQuarterTurns.forEach((v) =>
    bounded(v, "turn", -10000, 10000),
  );
  let rotation = 0;
  const cumulative = input.callerSignedQuarterTurns.map((v) => (rotation += v)),
    facings = cumulative.map((v) => modulo(input.initialFacingNeswCode + v, 4));
  return {
    facingNeswCodesAfterTurns: facings,
    signedCumulativeQuarterTurns: cumulative,
    observedFinalFacingNeswCode: facings[facings.length - 1],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialFacingNeswCode: 0,
  callerSignedQuarterTurns: [1, 1, -1, 4],
} satisfies Input;
export const exampleOutput = {
  facingNeswCodesAfterTurns: [1, 2, 1, 1],
  signedCumulativeQuarterTurns: [1, 2, 1, 5],
  observedFinalFacingNeswCode: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/facing-nsew-rotation-orientation-counter",
  title: "Facing NSEW Rotation Orientation Counter",
  description:
    "Track actual signed quarter-turn dance orientation under caller N/E/S/W stage convention and retain whole-turn winding; no compass/geodesy transform or wrapped-angle motion inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "facingNeswCodesAfterTurns",
      label: "Facing nesw codes after turns",
      kind: "numberList",
    },
    {
      id: "signedCumulativeQuarterTurns",
      label: "Signed cumulative quarter turns",
      kind: "numberList",
    },
    {
      id: "observedFinalFacingNeswCode",
      label: "Observed final facing nesw code",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialFacingNeswCode: value.initialFacingNeswCode as number,
      callerSignedQuarterTurns:
        value.callerSignedQuarterTurns as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
