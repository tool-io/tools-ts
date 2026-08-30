import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly tumorMarkerScore: number;
  readonly stromalMarkerScore: number;
  readonly immuneMarkerScore: number;
  readonly minimumPurity: number;
}>;
export type Output = Readonly<{
  readonly purityProxy: number;
  readonly passes: boolean;
}>;

export const calculate = (input: Input): Output => {
  const total =
    input.tumorMarkerScore + input.stromalMarkerScore + input.immuneMarkerScore;
  if (
    total <= 0 ||
    Math.min(
      input.tumorMarkerScore,
      input.stromalMarkerScore,
      input.immuneMarkerScore,
    ) < 0
  )
    simpleError(
      "tumorMarkerScore",
      "Nonnegative scores with positive total are required.",
    );
  const purityProxy = input.tumorMarkerScore / total;
  return { purityProxy, passes: purityProxy >= input.minimumPurity };
};

export const exampleInput = {
  tumorMarkerScore: 8,
  stromalMarkerScore: 2,
  immuneMarkerScore: 2,
  minimumPurity: 0.6,
} satisfies Input;
export const exampleOutput = {
  purityProxy: 0.6666666666666666,
  passes: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/tumor-purity-proxy",
  title: "Tumor Purity Proxy",
  description:
    "Compute a caller-supplied marker-based tumor purity proxy, not a clinical ESTIMATE score.",
  inputs: [
    { id: "tumorMarkerScore", kind: "number", label: "Tumor marker score" },
    {
      id: "stromalMarkerScore",
      kind: "number",
      label: "Stromal marker score",
    },
    { id: "immuneMarkerScore", kind: "number", label: "Immune marker score" },
    { id: "minimumPurity", kind: "number", label: "Minimum purity" },
  ],
  outputs: [
    { id: "purityProxy", kind: "number", label: "Purity proxy" },
    { id: "passes", kind: "boolean", label: "Passes" },
  ],
  calculate: (value) =>
    calculate({
      tumorMarkerScore: value.tumorMarkerScore as number,
      stromalMarkerScore: value.stromalMarkerScore as number,
      immuneMarkerScore: value.immuneMarkerScore as number,
      minimumPurity: value.minimumPurity as number,
    }),
});
export const run = tool.execute;
export default tool;
