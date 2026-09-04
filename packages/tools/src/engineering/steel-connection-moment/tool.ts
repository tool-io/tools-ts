import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedConnectionBoltTensionsN: readonly number[];
  readonly signedBoltRowLeverArmsM: readonly number[];
}>;
export type Output = Readonly<{ readonly signedConnectionMomentNm: number }>;
const inputFields = [
  {
    id: "observedConnectionBoltTensionsN",
    label: "Observed connection bolt tensions n",
    kind: "numberList",
  },
  {
    id: "signedBoltRowLeverArmsM",
    label: "Signed bolt row lever arms m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedConnectionBoltTensionsN,
    input.signedBoltRowLeverArmsM,
    "observedConnectionBoltTensionsN",
  );
  input.observedConnectionBoltTensionsN.forEach((v) =>
    nonnegative(v, "observedConnectionBoltTensionsN"),
  );
  return {
    signedConnectionMomentNm: sum(
      input.observedConnectionBoltTensionsN.map(
        (v, i) => v * input.signedBoltRowLeverArmsM[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedConnectionBoltTensionsN: [10, 20],
  signedBoltRowLeverArmsM: [1, -0.5],
} satisfies Input;
export const exampleOutput = { signedConnectionMomentNm: 0 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/steel-connection-moment",
  title: "Steel Connection Moment Calculator",
  description:
    "Inventory independently observed bolt-row tension/neutral reference lever arms, not equal-bolt direct tension or rated moment capacity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedConnectionMomentNm",
      label: "Signed connection moment nm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedConnectionBoltTensionsN:
        value.observedConnectionBoltTensionsN as readonly number[],
      signedBoltRowLeverArmsM:
        value.signedBoltRowLeverArmsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
