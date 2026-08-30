import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly detectedSpecies: readonly string[];
}>;
export type Output = Readonly<{
  readonly uniqueSpecies: readonly string[];
  readonly speciesCount: number;
  readonly mixedDetection: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.detectedSpecies.some((v) => !v.trim()))
    simpleError("detectedSpecies", "Nonempty species labels required.");
  const uniqueSpecies = [...new Set(input.detectedSpecies)];
  return {
    uniqueSpecies,
    speciesCount: uniqueSpecies.length,
    mixedDetection: uniqueSpecies.length > 1,
  };
};
export const exampleInput = {
  detectedSpecies: ["A", "A", "B"],
} satisfies Input;
export const exampleOutput = {
  uniqueSpecies: ["A", "B"],
  speciesCount: 2,
  mixedDetection: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/coinfection-species-count",
  title: "Coinfection Species Count",
  description:
    "Deduplicate reported parasite species and flag multiple-species detections.",
  inputs: [
    { id: "detectedSpecies", label: "Detected species", kind: "stringList" },
  ],
  outputs: [
    { id: "uniqueSpecies", label: "Unique species", kind: "stringList" },
    { id: "speciesCount", label: "Species count", kind: "number" },
    { id: "mixedDetection", label: "Mixed detection", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      detectedSpecies: value.detectedSpecies as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
