import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SumInterpretation = "numbers" | "numbers-and-ascii";

const decimalNumber = /^[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE][+-]?\d+)?$/;

export const sumParsedValues = (
  text: string,
  interpretation: SumInterpretation,
): number | null => {
  if (text.trim() === "") return null;
  const values = text
    .split(/[,\n]/)
    .map((token) => token.trim())
    .filter(Boolean)
    .flatMap((token) => {
      if (token === "Infinity" || token === "+Infinity") return [Infinity];
      if (token === "-Infinity") return [-Infinity];
      if (decimalNumber.test(token)) return [Number(token)];
      if (interpretation === "numbers-and-ascii" && /^[A-Za-z]$/.test(token))
        return [token.charCodeAt(0)];
      return [];
    });
  if (values.length === 0 || values.some(Number.isNaN)) return null;
  if (values.includes(Infinity) && values.includes(-Infinity)) return null;
  if (values.includes(Infinity)) return Infinity;
  if (values.includes(-Infinity)) return -Infinity;
  let total = 0;
  let compensation = 0;
  for (const value of values) {
    const next = total + value;
    if (!Number.isFinite(next)) return next;
    compensation +=
      Math.abs(total) >= Math.abs(value)
        ? total - next + value
        : value - next + total;
    total = next;
  }
  const sum = total + compensation;
  return Number.isNaN(sum) ? null : Object.is(sum, -0) ? 0 : sum;
};

export const sumExample = {
  input: { interpretation: "numbers", text: "1, 2, 3, 4, 5" },
  output: { sum: 15 },
} satisfies ToolExample<
  { readonly interpretation: SumInterpretation; readonly text: string },
  { readonly sum: number }
>;

export const sumTool = createSimpleTool({
  id: "arithmetic/sum",
  title: "Sum Calculator",
  description:
    "Sum comma- or line-separated values, optionally interpreting individual Latin letters as ASCII values.",
  inputs: [
    { id: "text", kind: "string", label: "Values" },
    {
      enum: ["numbers", "numbers-and-ascii"],
      id: "interpretation",
      kind: "string",
      label: "Value interpretation",
    },
  ],
  outputs: [{ id: "sum", kind: "number", label: "Sum" }],
  calculate: (input) => {
    const sum = sumParsedValues(
      input.text as string,
      input.interpretation as SumInterpretation,
    );
    if (sum === null)
      simpleError("text", "Enter at least one supported value with a defined sum.");
    return { sum };
  },
});

export const runSum = sumTool.execute;
export default sumTool;
