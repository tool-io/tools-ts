import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly measuredSourcePpfMicromolesSecond: readonly number[];
  readonly callerMatchedLumensPerMicromole: readonly number[];
}>;
export type Output = Readonly<{
  readonly calibratedLumensBySource: readonly number[];
  readonly combinedModeledLumens: number;
}>;
const inputFields = [
  {
    id: "measuredSourcePpfMicromolesSecond",
    label: "Measured source ppf micromoles second",
    kind: "numberList",
  },
  {
    id: "callerMatchedLumensPerMicromole",
    label: "Caller matched lumens per micromole",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedLumensPerMicromole.forEach((v) =>
    positive(v, "callerMatchedLumensPerMicromole"),
  );
  input.measuredSourcePpfMicromolesSecond.forEach((v) =>
    nonnegative(v, "measuredSourcePpfMicromolesSecond"),
  );
  aligned(
    input.measuredSourcePpfMicromolesSecond,
    input.callerMatchedLumensPerMicromole,
    "measuredSourcePpfMicromolesSecond",
  );
  const flux = input.measuredSourcePpfMicromolesSecond.map(
    (v, i) => v * input.callerMatchedLumensPerMicromole[i],
  );
  return { calibratedLumensBySource: flux, combinedModeledLumens: sum(flux) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredSourcePpfMicromolesSecond: [100, 200],
  callerMatchedLumensPerMicromole: [50, 60],
} satisfies Input;
export const exampleOutput = {
  calibratedLumensBySource: [5000, 12000],
  combinedModeledLumens: 17000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/ppf-to-lumens-converter",
  title: "PPF to Lumens Converter",
  description:
    "Translate actual source photon inventories using source-specific matched spectral photopic calibration; no universal PPF/lumen factor, inferred spectral distribution or canopy PPFD.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedLumensBySource",
      label: "Calibrated lumens by source",
      kind: "numberList",
    },
    {
      id: "combinedModeledLumens",
      label: "Combined modeled lumens",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredSourcePpfMicromolesSecond:
        value.measuredSourcePpfMicromolesSecond as readonly number[],
      callerMatchedLumensPerMicromole:
        value.callerMatchedLumensPerMicromole as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
