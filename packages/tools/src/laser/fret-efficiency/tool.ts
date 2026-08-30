import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly donorAcceptorDistance: number;
  readonly forsterRadius: number;
}>;
export type Output = Readonly<{
  readonly efficiencyFraction: number;
  readonly efficiencyPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.forsterRadius <= 0)
    simpleError(
      "forsterRadius",
      "Förster radius must be positive.",
      "invalid_radius",
    );
  const efficiencyFraction =
    1 / (1 + (input.donorAcceptorDistance / input.forsterRadius) ** 6);
  return { efficiencyFraction, efficiencyPercent: efficiencyFraction * 100 };
};

export const exampleInput = {
  donorAcceptorDistance: 5,
  forsterRadius: 5,
} satisfies Input;
export const exampleOutput = {
  efficiencyFraction: 0.5,
  efficiencyPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      donorAcceptorDistance: input.donorAcceptorDistance as number,
      forsterRadius: input.forsterRadius as number,
    }),
  description:
    "Calculate ideal Förster transfer efficiency from distance and Förster radius.",
  id: "laser/fret-efficiency",
  inputs: [
    {
      id: "donorAcceptorDistance",
      label: "Donor–acceptor distance",
      kind: "number",
      minimum: 0,
      unit: "length",
    },
    {
      id: "forsterRadius",
      label: "Förster radius",
      kind: "number",
      minimum: 0,
      unit: "length",
    },
  ],
  outputs: [
    {
      id: "efficiencyFraction",
      label: "FRET efficiency",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "efficiencyPercent",
      label: "FRET efficiency",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "FRET Efficiency",
});

export const run = tool.execute;
export default tool;
