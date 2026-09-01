import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, cssNumber } from "../shared.js";
export type Input = Readonly<{
  readonly styleKeyword: string;
  readonly variantKeyword: string;
  readonly weight: number;
  readonly stretchKeyword: string;
  readonly sizePx: number;
  readonly lineHeightPx: number;
  readonly fontFamily: string;
}>;
export type Output = Readonly<{ readonly cssFontShorthand: string }>;
const inputFields = [
  { id: "styleKeyword", label: "Style keyword", kind: "string" },
  { id: "variantKeyword", label: "Variant keyword", kind: "string" },
  { id: "weight", label: "Weight", kind: "number" },
  { id: "stretchKeyword", label: "Stretch keyword", kind: "string" },
  { id: "sizePx", label: "Size px", kind: "number" },
  { id: "lineHeightPx", label: "Line height px", kind: "number" },
  { id: "fontFamily", label: "Font family", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.weight, "weight");
  positive(input.sizePx, "sizePx");
  positive(input.lineHeightPx, "lineHeightPx");
  if (
    !["normal", "italic", "oblique"].includes(input.styleKeyword) ||
    !["normal", "small-caps"].includes(input.variantKeyword) ||
    input.weight < 1 ||
    input.weight > 1000 ||
    ![
      "normal",
      "ultra-condensed",
      "extra-condensed",
      "condensed",
      "semi-condensed",
      "semi-expanded",
      "expanded",
      "extra-expanded",
      "ultra-expanded",
    ].includes(input.stretchKeyword) ||
    !/^[A-Za-z][A-Za-z0-9 _-]{0,127}$/.test(input.fontFamily)
  )
    simpleError(
      "font",
      "Bounded canonical font keywords and a safe literal family name required.",
    );
  return {
    cssFontShorthand: `${input.styleKeyword} ${input.variantKeyword} ${cssNumber(input.weight)} ${input.stretchKeyword} ${cssNumber(input.sizePx)}px/${cssNumber(input.lineHeightPx)}px "${input.fontFamily}"`,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  styleKeyword: "italic",
  variantKeyword: "small-caps",
  weight: 700,
  stretchKeyword: "normal",
  sizePx: 16,
  lineHeightPx: 24,
  fontFamily: "Example Sans",
} satisfies Input;
export const exampleOutput = {
  cssFontShorthand: 'italic small-caps 700 normal 16px/24px "Example Sans"',
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/css-font-shorthand-order-builder",
  title: "CSS font Shorthand Order Builder",
  description:
    "Build CSS font shorthand in style/variant/weight/stretch/size/line-height/family order using literal validated family; shorthand accepts stretch keywords only, not longhand percentages. Other font settings are reset by CSS shorthand; no injected syntax or browser-support guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "cssFontShorthand", label: "Css font shorthand", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      styleKeyword: value.styleKeyword as string,
      variantKeyword: value.variantKeyword as string,
      weight: value.weight as number,
      stretchKeyword: value.stretchKeyword as string,
      sizePx: value.sizePx as number,
      lineHeightPx: value.lineHeightPx as number,
      fontFamily: value.fontFamily as string,
    }),
});
export const run = tool.execute;
export default tool;
