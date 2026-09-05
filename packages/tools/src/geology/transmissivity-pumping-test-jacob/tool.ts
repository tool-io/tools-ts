import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  linearFit,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly elapsedSeconds: readonly number[];
  readonly drawdownM: readonly number[];
  readonly constantPumpM3Second: number;
}>;
export type Output = Readonly<{
  readonly fittedTransmissivityM2Second: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "elapsedSeconds", label: "Elapsed seconds", kind: "numberList" },
  { id: "drawdownM", label: "Drawdown m", kind: "numberList" },
  {
    id: "constantPumpM3Second",
    label: "Constant pump m3 second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.elapsedSeconds.forEach((v) => positive(v, "elapsedSeconds"));
  positive(input.constantPumpM3Second, "constantPumpM3Second");
  const f = linearFit(input.elapsedSeconds.map(Math.log10), input.drawdownM);
  positive(f.slope, "late-time slope");
  return {
    fittedTransmissivityM2Second:
      (Math.LN10 * input.constantPumpM3Second) / (4 * Math.PI * f.slope),
    fitRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  elapsedSeconds: [1, 10, 100],
  drawdownM: [0, 1, 2],
  constantPumpM3Second: 1,
} satisfies Input;
export const exampleOutput = {
  fittedTransmissivityM2Second: 0.18323389971985696,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/transmissivity-pumping-test-jacob",
  title: "Geology Transmissivity Pumping Test Jacob Calculator",
  description:
    "FIT raw independently qualified late-time pumping time/drawdown; not existing supplied Cooper–Jacob slope formula. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedTransmissivityM2Second",
      label: "Fitted transmissivity m2 second",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      elapsedSeconds: value.elapsedSeconds as readonly number[],
      drawdownM: value.drawdownM as readonly number[],
      constantPumpM3Second: value.constantPumpM3Second as number,
    }),
});
export const run = tool.execute;
export default tool;
