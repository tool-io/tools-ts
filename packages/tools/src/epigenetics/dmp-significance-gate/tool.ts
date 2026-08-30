import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly adjustedP: number;
  readonly maximumAdjustedP: number;
  readonly deltaBeta: number;
  readonly minimumAbsoluteDeltaBeta: number;
}>;
export type Output = Readonly<{
  readonly significant: boolean;
  readonly effectQualified: boolean;
  readonly dmpCall: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.adjustedP < 0 ||
    input.adjustedP > 1 ||
    input.maximumAdjustedP < 0 ||
    input.maximumAdjustedP > 1 ||
    input.minimumAbsoluteDeltaBeta < 0
  )
    simpleError(
      "adjustedP",
      "Valid p-values and effect threshold are required.",
    );
  const significant = input.adjustedP <= input.maximumAdjustedP,
    effectQualified =
      Math.abs(input.deltaBeta) >= input.minimumAbsoluteDeltaBeta;
  return {
    significant,
    effectQualified,
    dmpCall: significant && effectQualified,
  };
};

export const exampleInput = {
  adjustedP: 0.01,
  maximumAdjustedP: 0.05,
  deltaBeta: 0.25,
  minimumAbsoluteDeltaBeta: 0.2,
} satisfies Input;
export const exampleOutput = {
  significant: true,
  effectQualified: true,
  dmpCall: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/dmp-significance-gate",
  title: "DMP Significance Gate",
  description:
    "Gate single-CpG differential methylation by FDR and effect size.",
  inputs: [
    { id: "adjustedP", kind: "number", label: "Adjusted p" },
    { id: "maximumAdjustedP", kind: "number", label: "Maximum adjusted p" },
    { id: "deltaBeta", kind: "number", label: "Delta beta" },
    {
      id: "minimumAbsoluteDeltaBeta",
      kind: "number",
      label: "Minimum absolute delta beta",
    },
  ],
  outputs: [
    { id: "significant", kind: "boolean", label: "Significant" },
    { id: "effectQualified", kind: "boolean", label: "Effect qualified" },
    { id: "dmpCall", kind: "boolean", label: "DMP call" },
  ],
  calculate: (value) =>
    calculate({
      adjustedP: value.adjustedP as number,
      maximumAdjustedP: value.maximumAdjustedP as number,
      deltaBeta: value.deltaBeta as number,
      minimumAbsoluteDeltaBeta: value.minimumAbsoluteDeltaBeta as number,
    }),
});
export const run = tool.execute;
export default tool;
