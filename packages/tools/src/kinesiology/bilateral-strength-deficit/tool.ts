import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly leftUnilateralForce: number;
  readonly rightUnilateralForce: number;
  readonly bilateralForce: number;
}>;
export type Output = Readonly<{
  readonly unilateralSum: number;
  readonly deficitPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.leftUnilateralForce < 0 ||
    input.rightUnilateralForce < 0 ||
    input.bilateralForce < 0 ||
    input.leftUnilateralForce + input.rightUnilateralForce <= 0
  )
    simpleError(
      "leftUnilateralForce",
      "Nonnegative force measurements and positive unilateral sum required.",
    );
  const unilateralSum = input.leftUnilateralForce + input.rightUnilateralForce;
  return {
    unilateralSum,
    deficitPercent:
      (100 * (unilateralSum - input.bilateralForce)) / unilateralSum,
  };
};
export const exampleInput = {
  leftUnilateralForce: 100,
  rightUnilateralForce: 100,
  bilateralForce: 180,
} satisfies Input;
export const exampleOutput = {
  unilateralSum: 200,
  deficitPercent: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/bilateral-strength-deficit",
  title: "Bilateral Strength Deficit",
  description:
    "Compare bilateral force with summed unilateral force to quantify deficit or facilitation.",
  inputs: [
    {
      id: "leftUnilateralForce",
      label: "Left unilateral force",
      kind: "number",
    },
    {
      id: "rightUnilateralForce",
      label: "Right unilateral force",
      kind: "number",
    },
    { id: "bilateralForce", label: "Bilateral force", kind: "number" },
  ],
  outputs: [
    { id: "unilateralSum", label: "Unilateral sum", kind: "number" },
    { id: "deficitPercent", label: "Deficit percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      leftUnilateralForce: value.leftUnilateralForce as number,
      rightUnilateralForce: value.rightUnilateralForce as number,
      bilateralForce: value.bilateralForce as number,
    }),
});
export const run = tool.execute;
export default tool;
