import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{ readonly subdivisionEmoji: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "subdivisionEmoji", label: "Subdivision emoji", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const c = Array.from(input.subdivisionEmoji, (v) => v.codePointAt(0)!);
  if (
    c.length < 4 ||
    c.length > 34 ||
    c[0] !== 0x1f3f4 ||
    c.at(-1) !== 0xe007f ||
    c
      .slice(1, -1)
      .some(
        (v) =>
          !((v >= 0xe0061 && v <= 0xe007a) || (v >= 0xe0030 && v <= 0xe0039)),
      )
  )
    simpleError(
      "emoji",
      "Black-flag,2–32lowercaseASCIIletter/digit tag scalars, cancel-tag syntax only.",
    );
  const tag = String.fromCodePoint(...c.slice(1, -1).map((v) => v - 0xe0000));
  return {
    syntacticSubdivisionTag: tag,
    recognizedRgiSubdivision:
      (
        { gbeng: "England", gbsct: "Scotland", gbwls: "Wales" } as Record<
          string,
          string
        >
      )[tag] ?? "not-in-pinned-RGI-subset",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    subdivisionEmoji:
      "\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f",
  },
  output: {
    result: {
      syntacticSubdivisionTag: "gbeng",
      recognizedRgiSubdivision: "England",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/subdivision-emoji-tag-decoder",
  title: "Subdivision Flag Emoji Tag Decoder",
  description:
    "Decode strict black-flag subdivision tag syntax and identify the three RGI Unicode 17.0.0 subdivision sequences England, Scotland, Wales. Other syntactic tags are not asserted valid ISO subdivision codes, RGI emoji or supported glyphs.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
