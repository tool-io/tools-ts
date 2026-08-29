import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const commands = new Set([
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "theta",
  "lambda",
  "mu",
  "pi",
  "sigma",
  "phi",
  "omega",
  "infty",
  "sum",
  "prod",
  "int",
  "sin",
  "cos",
  "tan",
  "log",
  "ln",
]);
export const convertTypstMath = (source: string): string => {
  const text = source.trim().replace(/^\$/, "").replace(/\$$/, "");
  if (!text.trim()) simpleError("typst", "Enter a math expression.");
  const tokens: string[] = [];
  const matcher = /\s*([A-Za-z]+|\d+(?:\.\d+)?|[()+\-*/^_,=])/gy;
  let offset = 0;
  while (offset < text.length) {
    matcher.lastIndex = offset;
    const match = matcher.exec(text);
    if (!match) {
      if (/^\s+$/.test(text.slice(offset))) break;
      simpleError(
        "typst",
        `Unsupported Typst math syntax near ${text.slice(offset, offset + 12)}.`,
      );
    }
    tokens.push(match![1]!);
    offset = matcher.lastIndex;
  }
  let position = 0;
  const peek = () => tokens[position];
  const take = () => tokens[position++];
  const expect = (token: string) => {
    if (take() !== token) simpleError("typst", `Expected ${token}.`);
  };
  const precedence: Readonly<Record<string, number>> = {
    "=": 1,
    "+": 2,
    "-": 2,
    "*": 3,
    "/": 3,
    "^": 4,
    _: 4,
  };
  const parse = (minimum = 0): string => {
    let left = "";
    const token = take();
    if (token === undefined)
      simpleError("typst", "Incomplete math expression.");
    if (token === "(") {
      left = parse(0);
      expect(")");
      left = `\\left(${left}\\right)`;
    } else if (token === "-") left = `-${parse(4)}`;
    else if (/^\d/.test(token)) left = token;
    else if (/^[A-Za-z]+$/.test(token)) {
      if ((token === "sqrt" || token === "frac") && peek() === "(") {
        take();
        const first = parse(0);
        if (token === "sqrt") {
          expect(")");
          left = `\\sqrt{${first}}`;
        } else {
          expect(",");
          const second = parse(0);
          expect(")");
          left = `\\frac{${first}}{${second}}`;
        }
      } else if (token.length === 1) left = token;
      else if (commands.has(token)) left = `\\${token}`;
      else simpleError("typst", `Unsupported named math symbol: ${token}.`);
    } else simpleError("typst", `Unexpected token: ${token}.`);
    while (
      peek() !== undefined &&
      (precedence[peek()!] ?? 0) >= minimum &&
      precedence[peek()!] !== undefined
    ) {
      const operator = take()!,
        rank = precedence[operator]!;
      const right = parse(
        operator === "^" || operator === "_" ? rank : rank + 1,
      );
      if (operator === "/") left = `\\frac{${left}}{${right}}`;
      else if (operator === "*") left = `${left} \\cdot ${right}`;
      else if (operator === "^") left = `${left}^{${right}}`;
      else if (operator === "_") left = `${left}_{${right}}`;
      else left = `${left} ${operator} ${right}`;
    }
    return left;
  };
  const latex = parse();
  if (position !== tokens.length)
    simpleError("typst", "Unconsumed math syntax remains.");
  return latex;
};

export const example = {
  input: { typst: "$x^2 + sqrt(y)$" },
  output: { latex: "x^{2} + \\sqrt{y}" },
} satisfies ToolExample<{ readonly typst: string }, { readonly latex: string }>;
export const tool = createSimpleTool({
  id: "convert/typst-math-to-latex",
  title: "Typst Math to LaTeX Converter",
  description:
    "Convert a documented subset of Typst math—numbers, single-letter variables, common named symbols, arithmetic, powers, subscripts, sqrt, and frac—to LaTeX. Unsupported Typst syntax is rejected rather than silently mistranslated.",
  inputs: [{ id: "typst", kind: "string", label: "Typst math" }],
  outputs: [{ id: "latex", kind: "string", label: "LaTeX math" }],
  calculate: (input) => ({ latex: convertTypstMath(input.typst as string) }),
});
export type TypstMathToLatexInput = Readonly<typeof example.input>;
export type TypstMathToLatexOutput = Readonly<typeof example.output>;
export const typstMathToLatexTool = tool;
export const runTypstMathToLatex = tool.execute;
export default tool;
