import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualChromaticityX: number;
  readonly actualChromaticityY: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualChromaticityX", label: "Actual chromaticity x", kind: "number" },
  { id: "actualChromaticityY", label: "Actual chromaticity y", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  fraction(input.actualChromaticityX, "actualChromaticityX");
  fraction(input.actualChromaticityY, "actualChromaticityY");
  if (
    input.actualChromaticityX <= 0 ||
    input.actualChromaticityY <= 0 ||
    input.actualChromaticityX + input.actualChromaticityY >= 1 ||
    Math.abs(input.actualChromaticityY - 0.1858) < 1e-8
  )
    simpleError("xy", "Interior xy and resolved McCamy denominator.");
  return {
    value:
      449 *
        ((input.actualChromaticityX - 0.332) /
          (0.1858 - input.actualChromaticityY)) **
          3 +
      3525 *
        ((input.actualChromaticityX - 0.332) /
          (0.1858 - input.actualChromaticityY)) **
          2 +
      6823.3 *
        ((input.actualChromaticityX - 0.332) /
          (0.1858 - input.actualChromaticityY)) +
      5520.33,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualChromaticityX: 0.332, actualChromaticityY: 0.34 },
  output: { result: { value: 5520.33 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/led-color-temperature",
  title: "LED Color Temperature Calculator",
  description:
    "Restricted McCamyapproximate CCT from actual CIE1931xynearwhite:449n\u00b3+3525n\u00b2+6823.3n+5520.33, n=(x\u2212.3320)/(.1858\u2212y). Approximation only/not meaningful saturated LED blackbody identity. Actual matched units/topology and independently established parameters; not a safe device/electrical design or verified manufacturer rating.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
