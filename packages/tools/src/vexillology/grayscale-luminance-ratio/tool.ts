import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualFirstLinearGrayscaleLuminance: number;
  readonly actualSecondLinearGrayscaleLuminance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFirstLinearGrayscaleLuminance",
    label: "Actual first linear grayscale luminance",
    kind: "number",
  },
  {
    id: "actualSecondLinearGrayscaleLuminance",
    label: "Actual second linear grayscale luminance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(
    input.actualFirstLinearGrayscaleLuminance,
    "actualFirstLinearGrayscaleLuminance",
  );
  positive(
    input.actualSecondLinearGrayscaleLuminance,
    "actualSecondLinearGrayscaleLuminance",
  );
  return {
    value:
      Math.max(
        input.actualFirstLinearGrayscaleLuminance,
        input.actualSecondLinearGrayscaleLuminance,
      ) /
      positive(
        Math.min(
          input.actualFirstLinearGrayscaleLuminance,
          input.actualSecondLinearGrayscaleLuminance,
        ),
        "dark",
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
  input: {
    actualFirstLinearGrayscaleLuminance: 2,
    actualSecondLinearGrayscaleLuminance: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/grayscale-luminance-ratio",
  title: "Grayscale Contrast Luminance Ratio Calculator",
  description:
    "PhysicalLINEARluminanceratioLbright/Ldark,noWCAG.05offset,sRGBgamma/rendering/colorconversion;dark0infiniteundefinedratio rejected. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
