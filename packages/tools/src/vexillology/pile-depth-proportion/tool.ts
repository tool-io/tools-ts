import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualObservedPileDepth: number;
  readonly actualObservedFlyLength: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedPileDepth",
    label: "Actual observed pile depth",
    kind: "number",
  },
  {
    id: "actualObservedFlyLength",
    label: "Actual observed fly length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualObservedPileDepth, "actualObservedPileDepth");
  positive(input.actualObservedFlyLength, "actualObservedFlyLength");
  return {
    value: input.actualObservedPileDepth / input.actualObservedFlyLength,
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
  input: { actualObservedPileDepth: 1, actualObservedFlyLength: 2 },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/pile-depth-proportion",
  title: "Pile Depth Proportion Calculator",
  description:
    "Actualflagpile-tipdepthfromhoist/flyproportion,not shieldtaperor assumedflagdesign norm. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
