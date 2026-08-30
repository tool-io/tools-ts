import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{ readonly speechTransmissionIndex: number }>;
export type Output = Readonly<{ readonly commonIntelligibilityScale: number }>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.speechTransmissionIndex) ||
    input.speechTransmissionIndex <= 0 ||
    input.speechTransmissionIndex > 1
  )
    simpleError(
      "speechTransmissionIndex",
      "STI must be greater than zero and no greater than one.",
      "invalid_sti",
    );
  return {
    commonIntelligibilityScale: 1 + Math.log10(input.speechTransmissionIndex),
  };
};

export const example = {
  input: { speechTransmissionIndex: 0.5 },
  output: { commonIntelligibilityScale: 0.6989700043360187 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { speechTransmissionIndex: 1 },
  output: { commonIntelligibilityScale: 1 },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      speechTransmissionIndex: input.speechTransmissionIndex as number,
    }),
  description:
    "Convert a positive Speech Transmission Index to Common Intelligibility Scale using CIS = 1 + log10(STI).",
  id: "acoustics/sti-to-cis",
  inputs: [
    {
      id: "speechTransmissionIndex",
      kind: "number",
      label: "Speech Transmission Index",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "commonIntelligibilityScale",
      kind: "number",
      label: "Common Intelligibility Scale",
      maximum: 1,
    },
  ],
  title: "STI to CIS",
});

export const run = tool.execute;
export default tool;
