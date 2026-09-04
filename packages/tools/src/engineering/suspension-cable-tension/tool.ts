import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly uniformHorizontalCableLoadNM: number;
  readonly cableSpanM: number;
  readonly cableMidspanSagM: number;
}>;
export type Output = Readonly<{
  readonly parabolicCableHorizontalTensionN: number;
  readonly parabolicCableSupportTensionN: number;
}>;
const inputFields = [
  {
    id: "uniformHorizontalCableLoadNM",
    label: "Uniform horizontal cable load n m",
    kind: "number",
  },
  { id: "cableSpanM", label: "Cable span m", kind: "number" },
  { id: "cableMidspanSagM", label: "Cable midspan sag m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.cableSpanM, "cableSpanM");
  positive(input.cableMidspanSagM, "cableMidspanSagM");
  nonnegative(
    input.uniformHorizontalCableLoadNM,
    "uniformHorizontalCableLoadNM",
  );
  const h =
      (input.uniformHorizontalCableLoadNM * input.cableSpanM ** 2) /
      (8 * input.cableMidspanSagM),
    v = (input.uniformHorizontalCableLoadNM * input.cableSpanM) / 2;
  return {
    parabolicCableHorizontalTensionN: h,
    parabolicCableSupportTensionN: Math.hypot(h, v),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  uniformHorizontalCableLoadNM: 2,
  cableSpanM: 4,
  cableMidspanSagM: 1,
} satisfies Input;
export const exampleOutput = {
  parabolicCableHorizontalTensionN: 4,
  parabolicCableSupportTensionN: 5.656854249492381,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/suspension-cable-tension",
  title: "Suspension Cable Tension Calculator",
  description:
    "Parabolic uniform horizontal-projection suspended load, horizontal/support tension distinct, not self-weight catenary or cable safety. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "parabolicCableHorizontalTensionN",
      label: "Parabolic cable horizontal tension n",
      kind: "number",
    },
    {
      id: "parabolicCableSupportTensionN",
      label: "Parabolic cable support tension n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      uniformHorizontalCableLoadNM:
        value.uniformHorizontalCableLoadNM as number,
      cableSpanM: value.cableSpanM as number,
      cableMidspanSagM: value.cableMidspanSagM as number,
    }),
});
export const run = tool.execute;
export default tool;
