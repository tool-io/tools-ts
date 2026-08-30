import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly postExtractionSpikeArea: number;
  readonly neatStandardArea: number;
}>;
export type Output = Readonly<{
  readonly matrixEffectPercent: number;
  readonly responsePercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.postExtractionSpikeArea < 0 || input.neatStandardArea <= 0)
    simpleError("neatStandardArea", "Neat standard area must be positive.");
  const responsePercent =
    (input.postExtractionSpikeArea / input.neatStandardArea) * 100;
  return { matrixEffectPercent: responsePercent - 100, responsePercent };
};
export const exampleInput = {
  postExtractionSpikeArea: 80,
  neatStandardArea: 100,
} satisfies Input;
export const exampleOutput = {
  matrixEffectPercent: -20,
  responsePercent: 80,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/matrix-ion-suppression",
  title: "Matrix Ion Suppression",
  description:
    "Quantify matrix-induced ion suppression or enhancement using a post-extraction spike.",
  inputs: [
    {
      id: "postExtractionSpikeArea",
      kind: "number",
      label: "Post extraction spike area",
    },
    { id: "neatStandardArea", kind: "number", label: "Neat standard area" },
  ],
  outputs: [
    {
      id: "matrixEffectPercent",
      kind: "number",
      label: "Matrix effect percent",
    },
    { id: "responsePercent", kind: "number", label: "Response percent" },
  ],
  calculate: (value) =>
    calculate({
      postExtractionSpikeArea: value.postExtractionSpikeArea as number,
      neatStandardArea: value.neatStandardArea as number,
    }),
});
export const run = tool.execute;
export default tool;
