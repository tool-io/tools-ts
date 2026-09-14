import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualRecordedRemovedLateralShootCount: number;
  readonly actualInitialObservedLateralShootCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedRemovedLateralShootCount",
    label: "Actual recorded removed lateral shoot count",
    kind: "number",
  },
  {
    id: "actualInitialObservedLateralShootCount",
    label: "Actual initial observed lateral shoot count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualRecordedRemovedLateralShootCount,
    "actualRecordedRemovedLateralShootCount",
    0,
    1000000,
  );
  bounded(
    input.actualInitialObservedLateralShootCount,
    "actualInitialObservedLateralShootCount",
    1,
    1000000,
  );
  if (
    input.actualRecordedRemovedLateralShootCount >
    input.actualInitialObservedLateralShootCount
  )
    simpleError("removed", "Actualremovedsubset≤initial.");
  return {
    value:
      (100 * input.actualRecordedRemovedLateralShootCount) /
      input.actualInitialObservedLateralShootCount,
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
  input: {
    actualRecordedRemovedLateralShootCount: 2,
    actualInitialObservedLateralShootCount: 10,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/lateral-shoot-removal-percent",
  title: "Lateral Shoot Removal Percent Calculator",
  description:
    "Actualretrospectivelateralshootremovalpercentage,not prescribepruning/removal or canopy/crophealth.",
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
