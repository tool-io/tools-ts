import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly heelStackMm: number;
  readonly forefootStackMm: number;
  readonly zeroDropToleranceMm: number;
}>;
export type Output = Readonly<{
  readonly heelDropMm: number;
  readonly zeroDrop: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.heelStackMm < 0 ||
    input.forefootStackMm < 0 ||
    input.zeroDropToleranceMm < 0
  )
    simpleError(
      "heelStackMm",
      "Nonnegative stack heights and zero-drop tolerance required.",
    );
  const heelDropMm = input.heelStackMm - input.forefootStackMm;
  return {
    heelDropMm,
    zeroDrop: Math.abs(heelDropMm) <= input.zeroDropToleranceMm,
  };
};
export const exampleInput = {
  heelStackMm: 30,
  forefootStackMm: 20,
  zeroDropToleranceMm: 2,
} satisfies Input;
export const exampleOutput = {
  heelDropMm: 10,
  zeroDrop: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/shoe-heel-drop",
  title: "Shoe Heel Drop",
  description:
    "Compute heel-to-forefoot shoe drop and screen a supplied zero-drop tolerance.",
  inputs: [
    { id: "heelStackMm", label: "Heel stack mm", kind: "number" },
    { id: "forefootStackMm", label: "Forefoot stack mm", kind: "number" },
    {
      id: "zeroDropToleranceMm",
      label: "Zero drop tolerance mm",
      kind: "number",
    },
  ],
  outputs: [
    { id: "heelDropMm", label: "Heel drop mm", kind: "number" },
    { id: "zeroDrop", label: "Zero drop", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      heelStackMm: value.heelStackMm as number,
      forefootStackMm: value.forefootStackMm as number,
      zeroDropToleranceMm: value.zeroDropToleranceMm as number,
    }),
});
export const run = tool.execute;
export default tool;
