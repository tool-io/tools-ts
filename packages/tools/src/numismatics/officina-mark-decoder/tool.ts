import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly mark: string;
  readonly script: "latin-number" | "latin-ordinal" | "greek";
}>;
export type Output = Readonly<{
  readonly officinaNumber: number;
  readonly normalizedMark: string;
}>;

export const calculate = (input: Input): Output => {
  const normalizedMark = input.mark.trim().toUpperCase();
  if (normalizedMark.length === 0)
    simpleError("mark", "Officina mark must not be empty.", "empty_mark");
  const latinNumbers: Readonly<Record<string, number>> = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
    VI: 6,
    VII: 7,
    VIII: 8,
    IX: 9,
    X: 10,
    XI: 11,
    XII: 12,
  };
  const latinOrdinals: Readonly<Record<string, number>> = {
    P: 1,
    S: 2,
    T: 3,
    Q: 4,
  };
  const greek: Readonly<Record<string, number>> = {
    Α: 1,
    Β: 2,
    Γ: 3,
    Δ: 4,
    Ε: 5,
    Ϛ: 6,
    Ζ: 7,
    Η: 8,
    Θ: 9,
    Ι: 10,
    A: 1,
    B: 2,
  };
  const officinaNumber =
    input.script === "latin-number"
      ? latinNumbers[normalizedMark]
      : input.script === "latin-ordinal"
        ? latinOrdinals[normalizedMark]
        : greek[normalizedMark];
  if (officinaNumber === undefined)
    simpleError(
      "mark",
      "Mark is unsupported for the selected script.",
      "unsupported_officina_mark",
    );
  return { officinaNumber, normalizedMark };
};

export const example = {
  input: { mark: "III", script: "latin-number" },
  output: { officinaNumber: 3, normalizedMark: "III" },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { mark: "β", script: "greek" },
  output: { officinaNumber: 2, normalizedMark: "Β" },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      mark: input.mark as string,
      script: input.script as Input["script"],
    }),
  description:
    "Decode common Latin-number, ordinal-letter, or Greek-numeral workshop marks to an officina number, with explicit script selection.",
  id: "numismatics/officina-mark-decoder",
  inputs: [
    { id: "mark", kind: "string", label: "Officina mark" },
    {
      id: "script",
      kind: "string",
      label: "Mark script",
      enum: ["latin-number", "latin-ordinal", "greek"],
    },
  ],
  outputs: [
    {
      id: "officinaNumber",
      kind: "integer",
      label: "Officina number",
      minimum: 1,
    },
    { id: "normalizedMark", kind: "string", label: "Normalized mark" },
  ],
  title: "Officina Mark Decoder",
});

export const run = tool.execute;
export default tool;
