import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly originalProperties: readonly number[];
  readonly replacementProperties: readonly number[];
  readonly severityCutoff: number;
}>;
export type Output = Readonly<{
  readonly granthamDistance: number;
  readonly aboveCutoff: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.originalProperties.length !== 3 ||
    input.replacementProperties.length !== 3
  )
    simpleError(
      "originalProperties",
      "Composition, polarity and volume triples required.",
    );
  nonnegative(input.severityCutoff, "severityCutoff");
  const delta = input.originalProperties.map(
      (v, i) => v - input.replacementProperties[i],
    ),
    granthamDistance =
      50.723 *
      Math.sqrt(
        1.833 * delta[0] ** 2 +
          0.1018 * delta[1] ** 2 +
          0.000399 * delta[2] ** 2,
      );
  return {
    granthamDistance,
    aboveCutoff: granthamDistance >= input.severityCutoff,
  };
};
export const exampleInput = {
  originalProperties: [1, 2, 3],
  replacementProperties: [1, 2, 3],
  severityCutoff: 100,
} satisfies Input;
export const exampleOutput = {
  granthamDistance: 0,
  aboveCutoff: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/grantham-property-distance",
  title: "Grantham Property Distance",
  description:
    "Compute Grantham distance from caller-supplied residue composition, polarity, and volume properties.",
  inputs: [
    {
      id: "originalProperties",
      label: "Original properties",
      kind: "numberList",
    },
    {
      id: "replacementProperties",
      label: "Replacement properties",
      kind: "numberList",
    },
    { id: "severityCutoff", label: "Severity cutoff", kind: "number" },
  ],
  outputs: [
    { id: "granthamDistance", label: "Grantham distance", kind: "number" },
    { id: "aboveCutoff", label: "Above cutoff", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      originalProperties: value.originalProperties as readonly number[],
      replacementProperties: value.replacementProperties as readonly number[],
      severityCutoff: value.severityCutoff as number,
    }),
});
export const run = tool.execute;
export default tool;
