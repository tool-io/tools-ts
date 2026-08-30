import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly horizontalEddyViscosityM2PerSecond: number;
  readonly linearDragPerSecond: number;
  readonly betaPerMeterSecond: number;
}>;
export type Output = Readonly<{
  readonly munkWidthM: number;
  readonly stommelWidthM: number;
  readonly largerScaleCode: number;
}>;
const inputFields = [
  {
    id: "horizontalEddyViscosityM2PerSecond",
    label: "Horizontal eddy viscosity m2 per second",
    kind: "number",
  },
  {
    id: "linearDragPerSecond",
    label: "Linear drag per second",
    kind: "number",
  },
  { id: "betaPerMeterSecond", label: "Beta per meter second", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.horizontalEddyViscosityM2PerSecond,
    "horizontalEddyViscosityM2PerSecond",
  );
  positive(input.betaPerMeterSecond, "betaPerMeterSecond");
  nonnegative(input.linearDragPerSecond, "linearDragPerSecond");
  const munkWidthM = Math.cbrt(
      input.horizontalEddyViscosityM2PerSecond / input.betaPerMeterSecond,
    ),
    stommelWidthM = input.linearDragPerSecond / input.betaPerMeterSecond;
  return {
    munkWidthM,
    stommelWidthM,
    largerScaleCode:
      munkWidthM > stommelWidthM ? 1 : stommelWidthM > munkWidthM ? 2 : 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  horizontalEddyViscosityM2PerSecond: 8,
  linearDragPerSecond: 2,
  betaPerMeterSecond: 1,
} satisfies Input;
export const exampleOutput = {
  munkWidthM: 2,
  stommelWidthM: 2,
  largerScaleCode: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/western-boundary-intensification-width",
  title: "Western Boundary Intensification Width",
  description:
    "Compare Munk lateral-viscosity and Stommel linear-drag boundary scales under supplied positive beta; these are alternative ideal balances, not a combined current-width solution.",
  inputs: inputFields,
  outputs: [
    { id: "munkWidthM", label: "Munk width m", kind: "number" },
    { id: "stommelWidthM", label: "Stommel width m", kind: "number" },
    { id: "largerScaleCode", label: "Larger scale code", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      horizontalEddyViscosityM2PerSecond:
        value.horizontalEddyViscosityM2PerSecond as number,
      linearDragPerSecond: value.linearDragPerSecond as number,
      betaPerMeterSecond: value.betaPerMeterSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
