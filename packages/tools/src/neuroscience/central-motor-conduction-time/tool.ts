import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedCorticalMepOnsetMs: number;
  readonly independentlyEstablishedPeripheralMotorTimeMs: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedCorticalMepOnsetMs",
    label: "Independently established cortical mep onset ms",
    kind: "number",
  },
  {
    id: "independentlyEstablishedPeripheralMotorTimeMs",
    label: "Independently established peripheral motor time ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyEstablishedCorticalMepOnsetMs, "onset");
  nonnegative(
    input.independentlyEstablishedPeripheralMotorTimeMs,
    "peripheral",
  );
  return {
    signedEstimatedCentralMotorConductionMs:
      input.independentlyEstablishedCorticalMepOnsetMs -
      input.independentlyEstablishedPeripheralMotorTimeMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedCorticalMepOnsetMs: 20,
    independentlyEstablishedPeripheralMotorTimeMs: 10,
  },
  output: { result: { signedEstimatedCentralMotorConductionMs: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/central-motor-conduction-time",
  title: "Central Motor Conduction Time Calculator",
  description:
    "Actual cortical MEPonset minus independently established peripheral motor conduction time, not component peak subtraction or automatic F/Mformula applicability. Negative discrepancy retained for qualified review, not a diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
