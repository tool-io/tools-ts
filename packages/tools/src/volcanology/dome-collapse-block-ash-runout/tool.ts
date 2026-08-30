import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly verticalDropM: number;
  readonly callerHeimRatioBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly horizontalRunoutScenarioBoundsM: readonly number[];
}>;
const inputFields = [
  { id: "verticalDropM", label: "Vertical drop m", kind: "number" },
  {
    id: "callerHeimRatioBounds",
    label: "Caller heim ratio bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerHeimRatioBounds.forEach((v) =>
    positive(v, "callerHeimRatioBounds"),
  );
  nonnegative(input.verticalDropM, "verticalDropM");
  if (
    input.callerHeimRatioBounds.length !== 2 ||
    input.callerHeimRatioBounds[0] > input.callerHeimRatioBounds[1]
  )
    simpleError(
      "callerHeimRatioBounds",
      "Two ordered positive empirical H/L ratios required.",
    );
  return {
    horizontalRunoutScenarioBoundsM: [
      input.verticalDropM / input.callerHeimRatioBounds[1],
      input.verticalDropM / input.callerHeimRatioBounds[0],
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  verticalDropM: 100,
  callerHeimRatioBounds: [0.1, 0.2],
} satisfies Input;
export const exampleOutput = {
  horizontalRunoutScenarioBoundsM: [500, 1000],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/dome-collapse-block-ash-runout",
  title: "Dome Collapse Block Ash Runout",
  description:
    "Translate supplied collapse relief and calibrated Heim-ratio bounds into horizontal-runout scenarios, not probability bounds, a dynamics model or exclusion-zone guidance.",
  inputs: inputFields,
  outputs: [
    {
      id: "horizontalRunoutScenarioBoundsM",
      label: "Horizontal runout scenario bounds m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      verticalDropM: value.verticalDropM as number,
      callerHeimRatioBounds: value.callerHeimRatioBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
