import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly withinClusterDistance: number;
  readonly nearestOtherClusterDistance: number;
}>;
export type Output = Readonly<{
  readonly silhouette: number;
  readonly separated: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.withinClusterDistance < 0 ||
    input.nearestOtherClusterDistance < 0 ||
    Math.max(input.withinClusterDistance, input.nearestOtherClusterDistance) ===
      0
  )
    simpleError(
      "withinClusterDistance",
      "At least one cluster distance must be positive.",
    );
  const a = input.withinClusterDistance,
    b = input.nearestOtherClusterDistance,
    silhouette = (b - a) / Math.max(a, b);
  return { silhouette, separated: silhouette > 0 };
};

export const exampleInput = {
  withinClusterDistance: 2,
  nearestOtherClusterDistance: 6,
} satisfies Input;
export const exampleOutput = {
  silhouette: 0.6666666666666666,
  separated: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/silhouette-score",
  title: "Silhouette Score",
  description:
    "Compute a silhouette width from within- and between-cluster distances.",
  inputs: [
    {
      id: "withinClusterDistance",
      kind: "number",
      label: "Within cluster distance",
    },
    {
      id: "nearestOtherClusterDistance",
      kind: "number",
      label: "Nearest other cluster distance",
    },
  ],
  outputs: [
    { id: "silhouette", kind: "number", label: "Silhouette" },
    { id: "separated", kind: "boolean", label: "Separated" },
  ],
  calculate: (value) =>
    calculate({
      withinClusterDistance: value.withinClusterDistance as number,
      nearestOtherClusterDistance: value.nearestOtherClusterDistance as number,
    }),
});
export const run = tool.execute;
export default tool;
