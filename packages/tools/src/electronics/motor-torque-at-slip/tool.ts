import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly signedSlipFraction: number;
  readonly breakdownSlipFraction: number;
  readonly callerBreakdownTorqueNm: number;
}>;
export type Output = Readonly<{ readonly klossModeledTorqueNm: number }>;
const inputFields = [
  { id: "signedSlipFraction", label: "Signed slip fraction", kind: "number" },
  {
    id: "breakdownSlipFraction",
    label: "Breakdown slip fraction",
    kind: "number",
  },
  {
    id: "callerBreakdownTorqueNm",
    label: "Caller breakdown torque nm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.breakdownSlipFraction, "breakdownSlipFraction");
  positive(input.callerBreakdownTorqueNm, "callerBreakdownTorqueNm");
  if (Math.abs(input.signedSlipFraction) > 1 || input.breakdownSlipFraction > 1)
    simpleError(
      "slip",
      "Kloss approximation restricted to slip magnitude ≤1 and breakdown slip (0,1].",
    );
  const ratio = input.signedSlipFraction / input.breakdownSlipFraction;
  return {
    klossModeledTorqueNm:
      (2 * input.callerBreakdownTorqueNm * ratio) / (1 + ratio * ratio),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signedSlipFraction: 0.1,
  breakdownSlipFraction: 0.1,
  callerBreakdownTorqueNm: 10,
} satisfies Input;
export const exampleOutput = { klossModeledTorqueNm: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/motor-torque-at-slip",
  title: "Motor Torque At Slip Calculator",
  description:
    "Evaluate caller calibrated Kloss induction-motor torque/slip approximation including zero-slip and generating sign; not PM-DC linear torque/speed model, start capability or thermal rating.",
  inputs: inputFields,
  outputs: [
    {
      id: "klossModeledTorqueNm",
      label: "Kloss modeled torque nm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      signedSlipFraction: value.signedSlipFraction as number,
      breakdownSlipFraction: value.breakdownSlipFraction as number,
      callerBreakdownTorqueNm: value.callerBreakdownTorqueNm as number,
    }),
});
export const run = tool.execute;
export default tool;
