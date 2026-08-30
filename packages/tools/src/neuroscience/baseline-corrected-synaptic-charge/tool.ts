import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, integral } from "../shared.js";
export type Input = Readonly<{
  readonly timesMs: readonly number[];
  readonly currentsPa: readonly number[];
  readonly baselinePa: number;
}>;
export type Output = Readonly<{
  readonly signedChargeFemtoCoulombs: number;
  readonly absoluteCurrentAreaFemtoCoulombs: number;
}>;
const inputFields = [
  { id: "timesMs", label: "Times ms", kind: "numberList" },
  { id: "currentsPa", label: "Currents pa", kind: "numberList" },
  { id: "baselinePa", label: "Baseline pa", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const net = input.currentsPa.map((v) => v - input.baselinePa),
    signedChargeFemtoCoulombs = integral(input.timesMs, net);
  let absoluteCurrentAreaFemtoCoulombs = 0;
  for (let i = 1; i < net.length; i++) {
    const a = net[i - 1],
      b = net[i],
      dt = input.timesMs[i] - input.timesMs[i - 1];
    absoluteCurrentAreaFemtoCoulombs +=
      a * b < 0
        ? (dt * (a * a + b * b)) / (2 * (Math.abs(a) + Math.abs(b)))
        : (dt * (Math.abs(a) + Math.abs(b))) / 2;
  }
  return { signedChargeFemtoCoulombs, absoluteCurrentAreaFemtoCoulombs };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesMs: [0, 1, 2],
  currentsPa: [-10, -30, -10],
  baselinePa: -10,
} satisfies Input;
export const exampleOutput = {
  signedChargeFemtoCoulombs: -20,
  absoluteCurrentAreaFemtoCoulombs: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/baseline-corrected-synaptic-charge",
  title: "Synaptic Charge Transfer",
  description:
    "Integrate a baseline-corrected synaptic current by trapezoids; pA·ms yields fC. Absolute-current area is distinct from the absolute value of net charge.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedChargeFemtoCoulombs",
      label: "Signed charge femto coulombs",
      kind: "number",
    },
    {
      id: "absoluteCurrentAreaFemtoCoulombs",
      label: "Absolute current area femto coulombs",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      timesMs: value.timesMs as readonly number[],
      currentsPa: value.currentsPa as readonly number[],
      baselinePa: value.baselinePa as number,
    }),
});
export const run = tool.execute;
export default tool;
