import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { aligned } from "../shared.js";

export type Input = Readonly<{
  readonly selectedTags: readonly string[];
  readonly targetSnps: readonly string[];
  readonly edgeTags: readonly string[];
  readonly edgeTargets: readonly string[];
}>;
export type Output = Readonly<{
  readonly capturedSnps: readonly string[];
  readonly uncapturedSnps: readonly string[];
  readonly capturePercent: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.edgeTags, input.edgeTargets, "edgeTags");
  const targets = new Set(input.targetSnps);
  if (
    !input.targetSnps.length ||
    new Set(input.targetSnps).size !== input.targetSnps.length ||
    input.edgeTargets.some((v) => !targets.has(v))
  )
    simpleError(
      "targetSnps",
      "Distinct target SNPs and aligned valid tagging edges required.",
    );
  const selected = new Set(input.selectedTags),
    captured = new Set(
      input.edgeTargets.filter((_, i) => selected.has(input.edgeTags[i])),
    ),
    capturedSnps = input.targetSnps.filter((v) => captured.has(v));
  return {
    capturedSnps,
    uncapturedSnps: input.targetSnps.filter((v) => !captured.has(v)),
    capturePercent: (100 * capturedSnps.length) / input.targetSnps.length,
  };
};
export const exampleInput = {
  selectedTags: ["T1"],
  targetSnps: ["A", "B", "C"],
  edgeTags: ["T1", "T1", "T2"],
  edgeTargets: ["A", "B", "C"],
} satisfies Input;
export const exampleOutput = {
  capturedSnps: ["A", "B"],
  uncapturedSnps: ["C"],
  capturePercent: 66.66666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/tag-snp-capture-coverage",
  title: "Tag SNP Capture Coverage",
  description:
    "Audit union coverage of target SNPs from caller-provided selected-tag capture edges.",
  inputs: [
    { id: "selectedTags", label: "Selected tags", kind: "stringList" },
    { id: "targetSnps", label: "Target snps", kind: "stringList" },
    { id: "edgeTags", label: "Edge tags", kind: "stringList" },
    { id: "edgeTargets", label: "Edge targets", kind: "stringList" },
  ],
  outputs: [
    { id: "capturedSnps", label: "Captured snps", kind: "stringList" },
    { id: "uncapturedSnps", label: "Uncaptured snps", kind: "stringList" },
    { id: "capturePercent", label: "Capture percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      selectedTags: value.selectedTags as readonly string[],
      targetSnps: value.targetSnps as readonly string[],
      edgeTags: value.edgeTags as readonly string[],
      edgeTargets: value.edgeTargets as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
