import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerSpecifiedExcavationClearance: number;
  readonly actualBatterBoardStakeClearance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerSpecifiedExcavationClearance",
    label: "Caller specified excavation clearance",
    kind: "number",
  },
  {
    id: "actualBatterBoardStakeClearance",
    label: "Actual batter board stake clearance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerSpecifiedExcavationClearance,
    "callerSpecifiedExcavationClearance",
  );
  nonnegative(
    input.actualBatterBoardStakeClearance,
    "actualBatterBoardStakeClearance",
  );
  return {
    value:
      input.callerSpecifiedExcavationClearance +
      input.actualBatterBoardStakeClearance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerSpecifiedExcavationClearance: 3,
    actualBatterBoardStakeClearance: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/site-batter-boards-offset",
  title: "Batter Boards Offset Calculator",
  description:
    "Explicit layouts takeoff set sum of independently specified excavation and stake clearances; does not select work-safe offset. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
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
