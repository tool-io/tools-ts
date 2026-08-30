import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly equilibriumAmplitude: number;
  readonly trMs: number;
  readonly t1Ms: number;
  readonly teMs: number;
  readonly t2Ms: number;
}>;
export type Output = Readonly<{
  readonly signalAmplitude: number;
}>;
const inputFields = [
  {
    id: "equilibriumAmplitude",
    label: "Equilibrium amplitude",
    kind: "number",
  },
  { id: "trMs", label: "Tr ms", kind: "number", unit: "ms" },
  { id: "t1Ms", label: "T1 ms", kind: "number", unit: "ms" },
  { id: "teMs", label: "Te ms", kind: "number", unit: "ms" },
  { id: "t2Ms", label: "T2 ms", kind: "number", unit: "ms" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.equilibriumAmplitude, "equilibriumAmplitude");
  positive(input.trMs, "trMs");
  positive(input.t1Ms, "t1Ms");
  nonnegative(input.teMs, "teMs");
  positive(input.t2Ms, "t2Ms");
  if (input.teMs >= input.trMs) simpleError("teMs", "TE must be below TR.");
  return {
    signalAmplitude:
      input.equilibriumAmplitude *
      (1 - Math.exp(-input.trMs / input.t1Ms)) *
      Math.exp(-input.teMs / input.t2Ms),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  equilibriumAmplitude: 100,
  trMs: 1000,
  t1Ms: 1000,
  teMs: 100,
  t2Ms: 100,
} satisfies Input;
export const exampleOutput = {
  signalAmplitude: 23.254415793482963,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/spin-echo-relaxation-signal",
  title: "Spin Echo Signal Intensity",
  description:
    "Evaluate an ideal saturation-recovery spin-echo signal M0(1−e^(−TR/T1))e^(−TE/T2); refocusing imperfections and stimulated echoes are excluded.",
  inputs: inputFields,
  outputs: [
    { id: "signalAmplitude", label: "Signal amplitude", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      equilibriumAmplitude: value.equilibriumAmplitude as number,
      trMs: value.trMs as number,
      t1Ms: value.t1Ms as number,
      teMs: value.teMs as number,
      t2Ms: value.t2Ms as number,
    }),
});
export const run = tool.execute;
export default tool;
