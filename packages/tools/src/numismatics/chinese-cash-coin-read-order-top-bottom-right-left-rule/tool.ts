import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, binary } from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerTopBottomRightLeftObservedGlyphs: readonly string[];
  readonly callerTopBottomRightLeftGlyphEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly orderedTopBottomRightLeftLegend: string;
  readonly completeLegendEvidence: boolean;
  readonly unobservedGlyphPositionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerTopBottomRightLeftObservedGlyphs",
    label: "Caller top bottom right left observed glyphs",
    kind: "stringList",
  },
  {
    id: "callerTopBottomRightLeftGlyphEvidenceFlags",
    label: "Caller top bottom right left glyph evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.callerTopBottomRightLeftObservedGlyphs.length !== 4 ||
    input.callerTopBottomRightLeftGlyphEvidenceFlags.length !== 4
  )
    simpleError(
      "glyphs",
      "Exactly top,bottom,right,left supplied positions required.",
    );
  binary(input.callerTopBottomRightLeftGlyphEvidenceFlags, "evidence");
  input.callerTopBottomRightLeftObservedGlyphs.forEach((v, i) => {
    if (
      input.callerTopBottomRightLeftGlyphEvidenceFlags[i] &&
      [...v].length !== 1
    )
      simpleError(
        "glyph",
        "One Unicode scalar per observed position required.",
      );
    if (
      v.length > 2 ||
      [...v].some((c) => {
        const n = c.codePointAt(0)!;
        return n >= 0xd800 && n <= 0xdfff;
      })
    )
      simpleError(
        "glyph",
        "Valid Unicode scalar glyph required; no lone surrogate.",
      );
  });
  return {
    orderedTopBottomRightLeftLegend:
      input.callerTopBottomRightLeftObservedGlyphs
        .map((v, i) =>
          input.callerTopBottomRightLeftGlyphEvidenceFlags[i] ? v : "?",
        )
        .join(""),
    completeLegendEvidence:
      input.callerTopBottomRightLeftGlyphEvidenceFlags.every((v) => v === 1),
    unobservedGlyphPositionIndices:
      input.callerTopBottomRightLeftGlyphEvidenceFlags.flatMap((v, i) =>
        v ? [] : [i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTopBottomRightLeftObservedGlyphs: ["乾", "隆", "通", "寶"],
  callerTopBottomRightLeftGlyphEvidenceFlags: [1, 1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  orderedTopBottomRightLeftLegend: "乾隆通寶",
  completeLegendEvidence: true,
  unobservedGlyphPositionIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/chinese-cash-coin-read-order-top-bottom-right-left-rule",
  title: "Chinese Cash Coin Read Order Top Bottom Right Left Rule",
  description:
    "Render actual Chinese cash legend annotations in explicitly supplied top,bottom,right,left positional convention with unknown placeholders; not OCR, universal read-order for every issue, dynasty attribution or text-word counting.",
  inputs: inputFields,
  outputs: [
    {
      id: "orderedTopBottomRightLeftLegend",
      label: "Ordered top bottom right left legend",
      kind: "string",
    },
    {
      id: "completeLegendEvidence",
      label: "Complete legend evidence",
      kind: "boolean",
    },
    {
      id: "unobservedGlyphPositionIndices",
      label: "Unobserved glyph position indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTopBottomRightLeftObservedGlyphs:
        value.callerTopBottomRightLeftObservedGlyphs as readonly string[],
      callerTopBottomRightLeftGlyphEvidenceFlags:
        value.callerTopBottomRightLeftGlyphEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
