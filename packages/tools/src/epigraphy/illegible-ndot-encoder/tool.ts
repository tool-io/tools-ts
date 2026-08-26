import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IllegibleNdotEncoderInput = {
  readonly letterCount: number;
  readonly dotStyle?: "period" | "middot";
};

export type IllegibleNdotEncoderOutput = {
  readonly encoding: string;
  readonly dotCount: number;
};

const DOTS: Record<
  NonNullable<IllegibleNdotEncoderInput["dotStyle"]>,
  string
> = {
  period: ".",
  middot: "\u00B7",
};

export const calculateIllegibleNdotEncoder = (
  input: IllegibleNdotEncoderInput,
): IllegibleNdotEncoderOutput => {
  if (!(
    Number.isInteger(input.letterCount) &&
    input.letterCount >= 1 &&
    input.letterCount <= 2000
  ))
    return simpleError(
      "letterCount",
      "Letter count must be an integer from 1 to 2,000.",
      "invalid_letter_count",
    );
  const dot = DOTS[input.dotStyle ?? "period"];
  return {
    encoding: `[${dot.repeat(input.letterCount)}]`,
    dotCount: input.letterCount,
  };
};

export const illegibleNdotEncoderExample = {
  input: { letterCount: 4 },
  output: { encoding: "[....]", dotCount: 4 },
} satisfies ToolExample<IllegibleNdotEncoderInput, IllegibleNdotEncoderOutput>;

export const illegibleNdotEncoderTool = createSimpleTool({
  id: "epigraphy/illegible-ndot-encoder",
  title: "Illegible Letter N-Dot Sequence Encoder",
  description:
    "Encode a lacuna of n illegible letters in Leiden notation as a square-bracketed dot series such as [....], using periods by default or middle dots.",
  inputs: [
    {
      description: "Number of illegible letters to encode.",
      id: "letterCount",
      kind: "integer",
      label: "Letter count",
      minimum: 1,
      maximum: 2000,
    },
    {
      default: "period",
      description: "Dot character used in the series.",
      enum: ["period", "middot"],
      id: "dotStyle",
      kind: "string",
      label: "Dot style",
    },
  ],
  outputs: [
    {
      description: "Bracketed dot-series encoding.",
      id: "encoding",
      kind: "string",
      label: "Encoding",
    },
    {
      description: "Number of dots emitted.",
      id: "dotCount",
      kind: "integer",
      label: "Dot count",
    },
  ],
  calculate: (input) =>
    calculateIllegibleNdotEncoder(
      input as unknown as IllegibleNdotEncoderInput,
    ),
});

export const runIllegibleNdotEncoder = illegibleNdotEncoderTool.execute;
export default illegibleNdotEncoderTool;
