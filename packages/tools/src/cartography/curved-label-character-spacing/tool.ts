import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly pathLengthMm: number;
  readonly glyphAdvanceTotalMm: number;
  readonly characterCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pathLengthMm", label: "Path length mm", kind: "number" },
  {
    id: "glyphAdvanceTotalMm",
    label: "Glyph advance total mm",
    kind: "number",
  },
  { id: "characterCount", label: "Character count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.pathLengthMm, "path");
  nonnegative(i.glyphAdvanceTotalMm, "advance");
  bounded(i.characterCount, "characters", 2, 1000000);
  return {
    extraGapMm:
      (i.pathLengthMm - i.glyphAdvanceTotalMm) / (i.characterCount - 1),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { pathLengthMm: 100, glyphAdvanceTotalMm: 80, characterCount: 5 },
  output: { result: { extraGapMm: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/curved-label-character-spacing",
  title: "Curved Label Character Spacing Along Path Calculator",
  description:
    "Signed uniform extra intercharacter gap along caller measured path arclength; negative spacing retained, no glyph orientation or kerning model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
