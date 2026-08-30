import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lossPerJointDb: number;
  readonly jointCount: number;
}>;
export type Output = Readonly<{
  readonly totalJointLossDb: number;
  readonly powerTransmissionFraction: number;
}>;

export const calculate = (input: Input): Output => {
  const totalJointLossDb = input.lossPerJointDb * input.jointCount;
  return {
    totalJointLossDb,
    powerTransmissionFraction: 10 ** (-totalJointLossDb / 10),
  };
};

export const exampleInput = {
  lossPerJointDb: 1,
  jointCount: 3,
} satisfies Input;
export const exampleOutput = {
  totalJointLossDb: 3,
  powerTransmissionFraction: 0.5011872336272722,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      lossPerJointDb: input.lossPerJointDb as number,
      jointCount: input.jointCount as number,
    }),
  description:
    "Calculate cumulative hollow-waveguide joint loss and transmission.",
  id: "laser/waveguide-joint-loss",
  inputs: [
    {
      id: "lossPerJointDb",
      label: "Loss per waveguide joint",
      kind: "number",
      minimum: 0,
      unit: "dB",
    },
    { id: "jointCount", label: "Joint count", kind: "integer", minimum: 0 },
  ],
  outputs: [
    {
      id: "totalJointLossDb",
      label: "Total joint loss",
      kind: "number",
      minimum: 0,
      unit: "dB",
    },
    {
      id: "powerTransmissionFraction",
      label: "Power transmission fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "Waveguide Joint Loss",
});

export const run = tool.execute;
export default tool;
