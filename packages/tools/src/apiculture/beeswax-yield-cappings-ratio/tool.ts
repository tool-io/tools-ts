import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly wetCappingsKg: number;
  readonly waterMassFraction: number;
  readonly solubleHoneyMassFraction: number;
  readonly waxRenderingRecoveryFraction: number;
}>;
export type Output = Readonly<{
  readonly estimatedDryWaxKg: number;
  readonly expectedRenderedWaxKg: number;
}>;
const inputFields = [
  { id: "wetCappingsKg", label: "Wet cappings kg", kind: "number" },
  { id: "waterMassFraction", label: "Water mass fraction", kind: "number" },
  {
    id: "solubleHoneyMassFraction",
    label: "Soluble honey mass fraction",
    kind: "number",
  },
  {
    id: "waxRenderingRecoveryFraction",
    label: "Wax rendering recovery fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.wetCappingsKg, "wetCappingsKg");
  fraction(input.waterMassFraction, "waterMassFraction");
  fraction(input.solubleHoneyMassFraction, "solubleHoneyMassFraction");
  fraction(input.waxRenderingRecoveryFraction, "waxRenderingRecoveryFraction");
  if (input.waterMassFraction + input.solubleHoneyMassFraction > 1)
    simpleError(
      "solubleHoneyMassFraction",
      "Disjoint water and honey fractions cannot exceed one.",
    );
  const estimatedDryWaxKg =
    input.wetCappingsKg *
    (1 - input.waterMassFraction - input.solubleHoneyMassFraction);
  return {
    estimatedDryWaxKg,
    expectedRenderedWaxKg:
      estimatedDryWaxKg * input.waxRenderingRecoveryFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wetCappingsKg: 10,
  waterMassFraction: 0.1,
  solubleHoneyMassFraction: 0.6,
  waxRenderingRecoveryFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  estimatedDryWaxKg: 3,
  expectedRenderedWaxKg: 2.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/beeswax-yield-cappings-ratio",
  title: "Beeswax Yield Cappings Ratio",
  description:
    "Balance disjoint water/honey fractions out of wet cappings and apply caller rendering recovery to residual dry wax; excludes unmeasured debris and no fixed wax-yield ratio.",
  inputs: inputFields,
  outputs: [
    { id: "estimatedDryWaxKg", label: "Estimated dry wax kg", kind: "number" },
    {
      id: "expectedRenderedWaxKg",
      label: "Expected rendered wax kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      wetCappingsKg: value.wetCappingsKg as number,
      waterMassFraction: value.waterMassFraction as number,
      solubleHoneyMassFraction: value.solubleHoneyMassFraction as number,
      waxRenderingRecoveryFraction:
        value.waxRenderingRecoveryFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
