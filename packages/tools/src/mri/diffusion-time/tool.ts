import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualPgseGradientLeadingEdgeSeparationSeconds: number;
  readonly actualRectangularGradientDurationSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPgseGradientLeadingEdgeSeparationSeconds",
    label: "Actual pgse gradient leading edge separation seconds",
    kind: "number",
  },
  {
    id: "actualRectangularGradientDurationSeconds",
    label: "Actual rectangular gradient duration seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualPgseGradientLeadingEdgeSeparationSeconds,
    "actualPgseGradientLeadingEdgeSeparationSeconds",
  );
  positive(
    input.actualRectangularGradientDurationSeconds,
    "actualRectangularGradientDurationSeconds",
  );
  if (
    input.actualPgseGradientLeadingEdgeSeparationSeconds <
    input.actualRectangularGradientDurationSeconds
  )
    simpleError("timing", "DeclaredPGSEΔ≥δ.");
  return {
    value:
      input.actualPgseGradientLeadingEdgeSeparationSeconds -
      input.actualRectangularGradientDurationSeconds / 3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPgseGradientLeadingEdgeSeparationSeconds: 1,
    actualRectangularGradientDurationSeconds: 0.3,
  },
  output: { result: { value: 0.9 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/diffusion-time",
  title: "Diffusion Time Calculator",
  description:
    "Restricted rectangular PGSE effective diffusion time\u0394\u2212\u03b4/3, same timing/no arbitrary mix sequence, max waveforms external. Not pick diffusion clinical scan parameters.",
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
