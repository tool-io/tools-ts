import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyAssessedAsymmetryFactor: number;
  readonly actualInitialSymmetricalRmsFaultAmps: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyAssessedAsymmetryFactor",
    label: "Caller independently assessed asymmetry factor",
    kind: "number",
  },
  {
    id: "actualInitialSymmetricalRmsFaultAmps",
    label: "Actual initial symmetrical rms fault amps",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerIndependentlyAssessedAsymmetryFactor,
    "callerIndependentlyAssessedAsymmetryFactor",
  );
  nonnegative(
    input.actualInitialSymmetricalRmsFaultAmps,
    "actualInitialSymmetricalRmsFaultAmps",
  );
  return {
    value:
      Math.sqrt(2) *
      input.callerIndependentlyAssessedAsymmetryFactor *
      input.actualInitialSymmetricalRmsFaultAmps,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyAssessedAsymmetryFactor: 2,
    actualInitialSymmetricalRmsFaultAmps: 10,
  },
  output: { result: { value: 28.284271247461902 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/fault-current-peak",
  title: "Peak Fault Current Calculator",
  description:
    "Specified IEC peak ip=\u03ba\u221a2Ik,\u03baindependently established from network/RX method; not plain RMS peak or interrupting rating. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
