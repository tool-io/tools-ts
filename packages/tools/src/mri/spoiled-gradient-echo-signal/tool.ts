import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  flipRadians,
} from "../shared.js";
export type Input = Readonly<{
  readonly equilibriumAmplitude: number;
  readonly trMs: number;
  readonly t1Ms: number;
  readonly teMs: number;
  readonly t2StarMs: number;
  readonly flipDegrees: number;
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
  { id: "t2StarMs", label: "T2 star ms", kind: "number", unit: "ms" },
  { id: "flipDegrees", label: "Flip degrees", kind: "number", unit: "°" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.equilibriumAmplitude, "equilibriumAmplitude");
  positive(input.trMs, "trMs");
  positive(input.t1Ms, "t1Ms");
  nonnegative(input.teMs, "teMs");
  positive(input.t2StarMs, "t2StarMs");
  if (input.teMs >= input.trMs) simpleError("teMs", "TE must be below TR.");
  const angle = flipRadians(input.flipDegrees),
    e = Math.exp(-input.trMs / input.t1Ms);
  return {
    signalAmplitude:
      ((input.equilibriumAmplitude * (1 - e) * Math.sin(angle)) /
        (1 - e * Math.cos(angle))) *
      Math.exp(-input.teMs / input.t2StarMs),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  equilibriumAmplitude: 100,
  trMs: 100,
  t1Ms: 1000,
  teMs: 10,
  t2StarMs: 50,
  flipDegrees: 30,
} satisfies Input;
export const exampleOutput = {
  signalAmplitude: 18.002985590840964,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/spoiled-gradient-echo-signal",
  title: "SPGR Signal Intensity",
  description:
    "Evaluate ideal fully spoiled gradient-echo steady-state signal with explicit T2* attenuation; receiver gain is included in caller equilibrium amplitude.",
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
      t2StarMs: value.t2StarMs as number,
      flipDegrees: value.flipDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
