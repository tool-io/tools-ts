import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly benchHeightM: number;
  readonly heightCoefficient: number;
  readonly baseAllowanceM: number;
  readonly availableCatchWidthM: number;
}>;
export type Output = Readonly<{
  readonly calibratedCatchWidthM: number;
  readonly widthMarginM: number;
  readonly meetsCalibratedWidth: boolean;
}>;
const inputFields = [
  { id: "benchHeightM", label: "Bench height m", kind: "number" },
  { id: "heightCoefficient", label: "Height coefficient", kind: "number" },
  { id: "baseAllowanceM", label: "Base allowance m", kind: "number" },
  {
    id: "availableCatchWidthM",
    label: "Available catch width m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.benchHeightM, "benchHeightM");
  nonnegative(input.heightCoefficient, "heightCoefficient");
  nonnegative(input.baseAllowanceM, "baseAllowanceM");
  nonnegative(input.availableCatchWidthM, "availableCatchWidthM");
  const calibratedCatchWidthM =
    input.heightCoefficient * input.benchHeightM + input.baseAllowanceM;
  return {
    calibratedCatchWidthM,
    widthMarginM: input.availableCatchWidthM - calibratedCatchWidthM,
    meetsCalibratedWidth: input.availableCatchWidthM >= calibratedCatchWidthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  benchHeightM: 10,
  heightCoefficient: 0.2,
  baseAllowanceM: 4,
  availableCatchWidthM: 5,
} satisfies Input;
export const exampleOutput = {
  calibratedCatchWidthM: 6,
  widthMarginM: -1,
  meetsCalibratedWidth: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/berm-width",
  title: "Berm Width",
  description:
    "Screen catch-berm width against caller-calibrated height/intercept relation; rockfall trajectories, retained debris and legal criteria are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedCatchWidthM",
      label: "Calibrated catch width m",
      kind: "number",
    },
    { id: "widthMarginM", label: "Width margin m", kind: "number" },
    {
      id: "meetsCalibratedWidth",
      label: "Meets calibrated width",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      benchHeightM: value.benchHeightM as number,
      heightCoefficient: value.heightCoefficient as number,
      baseAllowanceM: value.baseAllowanceM as number,
      availableCatchWidthM: value.availableCatchWidthM as number,
    }),
});
export const run = tool.execute;
export default tool;
