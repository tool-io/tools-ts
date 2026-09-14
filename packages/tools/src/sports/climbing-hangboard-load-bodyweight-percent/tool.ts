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
  readonly actualBodyMassKg: number;
  readonly actualAddedMassKg: number;
  readonly actualAssistedMassKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualBodyMassKg", label: "Actual body mass kg", kind: "number" },
  { id: "actualAddedMassKg", label: "Actual added mass kg", kind: "number" },
  {
    id: "actualAssistedMassKg",
    label: "Actual assisted mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualBodyMassKg, "actualBodyMassKg");
  nonnegative(input.actualAddedMassKg, "actualAddedMassKg");
  nonnegative(input.actualAssistedMassKg, "actualAssistedMassKg");
  return {
    value:
      (100 *
        (input.actualBodyMassKg +
          input.actualAddedMassKg -
          input.actualAssistedMassKg)) /
      input.actualBodyMassKg,
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
    actualBodyMassKg: 10,
    actualAddedMassKg: 2,
    actualAssistedMassKg: 0,
  },
  output: { result: { value: 120 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/climbing-hangboard-load-bodyweight-percent",
  title: "Hangboard Load Bodyweight Percent",
  description:
    "Actualnetstatic supportedmass/bodymasspercent,includedbodyweight,assistanceloss/exceedanceexplicit;not hangboardprescriptionor tissue-loadsafety. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
