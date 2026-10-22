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
  readonly actualVerticalGainMeters: number;
  readonly actualObservedElapsedSeconds: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualVerticalGainMeters",
    label: "Actual vertical gain meters",
    kind: "number",
  },
  {
    id: "actualObservedElapsedSeconds",
    label: "Actual observed elapsed seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(input.actualVerticalGainMeters, "actualVerticalGainMeters");
  positive(input.actualObservedElapsedSeconds, "actualObservedElapsedSeconds");
  return {
    value:
      (3600 * input.actualVerticalGainMeters) /
      input.actualObservedElapsedSeconds,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualVerticalGainMeters: 100, actualObservedElapsedSeconds: 200 },
  output: { result: { value: 1800 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/ski-vertical-meters-per-hour-climb-rate",
  title: "Ski Climb Vertical Meters/Hour Rate",
  description:
    "ActualskiVERTICALgainrate m/hour,not horizontalpaceor safeeffort. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
