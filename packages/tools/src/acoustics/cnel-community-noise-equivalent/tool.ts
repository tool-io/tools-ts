import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, logSum } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualDayLeqDb: number;
  readonly actualEveningLeqDb: number;
  readonly actualNightLeqDb: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualDayLeqDb", label: "Actual day leq db", kind: "number" },
  { id: "actualEveningLeqDb", label: "Actual evening leq db", kind: "number" },
  { id: "actualNightLeqDb", label: "Actual night leq db", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    cnelDb: logSum(
      [
        input.actualDayLeqDb,
        input.actualEveningLeqDb + 5,
        input.actualNightLeqDb + 10,
      ],
      [12, 3, 9],
    ),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualDayLeqDb: 60, actualEveningLeqDb: 60, actualNightLeqDb: 60 },
  output: { result: { cnelDb: 66.67012336869195 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/cnel-community-noise-equivalent",
  title: "CNEL Community Noise Equivalent Calculator",
  description:
    "DeclaredCaliforniaCNEL12day3evening9night hourwindows,+5/+10dBpenalties,allactualLeqwindowscomplete,noconflateLden16/8 convention. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
