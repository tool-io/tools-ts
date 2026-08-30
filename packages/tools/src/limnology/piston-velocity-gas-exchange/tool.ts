import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly referencePistonVelocityMPerDay: number;
  readonly gasSchmidtNumber: number;
  readonly referenceSchmidtNumber: number;
  readonly schmidtExponent: number;
}>;
export type Output = Readonly<{ readonly scaledPistonVelocityMPerDay: number }>;
const inputFields = [
  {
    id: "referencePistonVelocityMPerDay",
    label: "Reference piston velocity m per day",
    kind: "number",
  },
  { id: "gasSchmidtNumber", label: "Gas schmidt number", kind: "number" },
  {
    id: "referenceSchmidtNumber",
    label: "Reference schmidt number",
    kind: "number",
  },
  { id: "schmidtExponent", label: "Schmidt exponent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.gasSchmidtNumber, "gasSchmidtNumber");
  positive(input.referenceSchmidtNumber, "referenceSchmidtNumber");
  positive(input.schmidtExponent, "schmidtExponent");
  nonnegative(
    input.referencePistonVelocityMPerDay,
    "referencePistonVelocityMPerDay",
  );
  return {
    scaledPistonVelocityMPerDay:
      input.referencePistonVelocityMPerDay *
      (input.gasSchmidtNumber / input.referenceSchmidtNumber) **
        -input.schmidtExponent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referencePistonVelocityMPerDay: 2,
  gasSchmidtNumber: 600,
  referenceSchmidtNumber: 600,
  schmidtExponent: 0.5,
} satisfies Input;
export const exampleOutput = {
  scaledPistonVelocityMPerDay: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/piston-velocity-gas-exchange",
  title: "Piston Velocity Gas Exchange",
  description:
    "Scale a measured reference gas-transfer piston velocity by a supplied Schmidt-number power relation; does not infer wind dependence or gas concentration gradients.",
  inputs: inputFields,
  outputs: [
    {
      id: "scaledPistonVelocityMPerDay",
      label: "Scaled piston velocity m per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referencePistonVelocityMPerDay:
        value.referencePistonVelocityMPerDay as number,
      gasSchmidtNumber: value.gasSchmidtNumber as number,
      referenceSchmidtNumber: value.referenceSchmidtNumber as number,
      schmidtExponent: value.schmidtExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
