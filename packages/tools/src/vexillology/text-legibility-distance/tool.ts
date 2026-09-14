import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLetterHeightMeters: number;
  readonly callerIndependentlyValidatedVisibilityDistancePerLetterHeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLetterHeightMeters",
    label: "Actual letter height meters",
    kind: "number",
  },
  {
    id: "callerIndependentlyValidatedVisibilityDistancePerLetterHeight",
    label:
      "Caller independently validated visibility distance per letter height",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualLetterHeightMeters, "actualLetterHeightMeters");
  positive(
    input.callerIndependentlyValidatedVisibilityDistancePerLetterHeight,
    "callerIndependentlyValidatedVisibilityDistancePerLetterHeight",
  );
  return {
    value:
      input.actualLetterHeightMeters *
      input.callerIndependentlyValidatedVisibilityDistancePerLetterHeight,
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
    actualLetterHeightMeters: 0.2,
    callerIndependentlyValidatedVisibilityDistancePerLetterHeight: 100,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/text-legibility-distance",
  title: "Text Legibility Distance Multiplier Calculator",
  description:
    "Conditionalletterheight\u00d7independentlyvalidateddistance/heightfactor,not universalacuity/contrast/illumination guarantee. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
