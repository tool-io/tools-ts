import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly uniformHorizontalArchLoadNM: number;
  readonly archSpanM: number;
  readonly archRiseM: number;
}>;
export type Output = Readonly<{
  readonly threeHingeParabolicArchHorizontalThrustN: number;
}>;
const inputFields = [
  {
    id: "uniformHorizontalArchLoadNM",
    label: "Uniform horizontal arch load n m",
    kind: "number",
  },
  { id: "archSpanM", label: "Arch span m", kind: "number" },
  { id: "archRiseM", label: "Arch rise m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.archSpanM, "archSpanM");
  positive(input.archRiseM, "archRiseM");
  nonnegative(input.uniformHorizontalArchLoadNM, "uniformHorizontalArchLoadNM");
  return {
    threeHingeParabolicArchHorizontalThrustN:
      (input.uniformHorizontalArchLoadNM * input.archSpanM ** 2) /
      (8 * input.archRiseM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  uniformHorizontalArchLoadNM: 2,
  archSpanM: 4,
  archRiseM: 1,
} satisfies Input;
export const exampleOutput = {
  threeHingeParabolicArchHorizontalThrustN: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/arch-thrust",
  title: "Arch Thrust Calculator",
  description:
    "Ideal three-hinged parabolic arch under uniform HORIZONTAL-span load wL²/(8f), not arbitrary arch shape/load. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "threeHingeParabolicArchHorizontalThrustN",
      label: "Three hinge parabolic arch horizontal thrust n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      uniformHorizontalArchLoadNM: value.uniformHorizontalArchLoadNM as number,
      archSpanM: value.archSpanM as number,
      archRiseM: value.archRiseM as number,
    }),
});
export const run = tool.execute;
export default tool;
