import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerInfiniteCrosswindLineSourceKgSecondM: number;
  readonly windMSecond: number;
  readonly sigmaZM: number;
  readonly receptorHeightM: number;
  readonly sourceHeightM: number;
}>;
export type Output = Readonly<{
  readonly reflectedInfiniteLineSourceKgM3: number;
}>;
const inputFields = [
  {
    id: "callerInfiniteCrosswindLineSourceKgSecondM",
    label: "Caller infinite crosswind line source kg second m",
    kind: "number",
  },
  { id: "windMSecond", label: "Wind m second", kind: "number" },
  { id: "sigmaZM", label: "Sigma z m", kind: "number" },
  { id: "receptorHeightM", label: "Receptor height m", kind: "number" },
  { id: "sourceHeightM", label: "Source height m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.windMSecond, "windMSecond");
  positive(input.sigmaZM, "sigmaZM");
  nonnegative(
    input.callerInfiniteCrosswindLineSourceKgSecondM,
    "callerInfiniteCrosswindLineSourceKgSecondM",
  );
  nonnegative(input.receptorHeightM, "receptorHeightM");
  nonnegative(input.sourceHeightM, "sourceHeightM");
  return {
    reflectedInfiniteLineSourceKgM3:
      (input.callerInfiniteCrosswindLineSourceKgSecondM /
        (Math.sqrt(2 * Math.PI) * input.windMSecond * input.sigmaZM)) *
      (Math.exp(
        -0.5 *
          ((input.receptorHeightM - input.sourceHeightM) / input.sigmaZM) ** 2,
      ) +
        Math.exp(
          -0.5 *
            ((input.receptorHeightM + input.sourceHeightM) / input.sigmaZM) **
              2,
        )),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerInfiniteCrosswindLineSourceKgSecondM: 1,
  windMSecond: 2,
  sigmaZM: 3,
  receptorHeightM: 0,
  sourceHeightM: 0,
} satisfies Input;
export const exampleOutput = {
  reflectedInfiniteLineSourceKgM3: 0.1329807601338109,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/gaussian-line-source",
  title: "Gaussian Line Source Calculator",
  description:
    "Steady infinite crosswind Gaussian line source integrated laterally with reflecting ground, not point plume or arbitrary wind/road angle. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "reflectedInfiniteLineSourceKgM3",
      label: "Reflected infinite line source kg m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerInfiniteCrosswindLineSourceKgSecondM:
        value.callerInfiniteCrosswindLineSourceKgSecondM as number,
      windMSecond: value.windMSecond as number,
      sigmaZM: value.sigmaZM as number,
      receptorHeightM: value.receptorHeightM as number,
      sourceHeightM: value.sourceHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;
