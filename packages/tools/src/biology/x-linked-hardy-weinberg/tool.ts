import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const xLinkedHardyWeinbergExample = {
  input: { recessiveAlleleFrequency: 0.08 },
  output: { affectedMaleFrequency: 0.08 },
} satisfies ToolExample<
  { readonly recessiveAlleleFrequency: number },
  { readonly affectedMaleFrequency: number }
>;

export const xLinkedHardyWeinbergTool = createSimpleTool({
  id: "biology/x-linked-hardy-weinberg",
  title: "X-Linked Male Frequency",
  description:
    "Compute the frequency of affected males for an X-linked recessive trait, equal to the recessive allele frequency q under Hardy-Weinberg assumptions.",
  inputs: [
    {
      id: "recessiveAlleleFrequency",
      kind: "number",
      label: "Recessive allele frequency",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "affectedMaleFrequency",
      kind: "number",
      label: "Affected male frequency",
    },
  ],
  calculate: (input) => ({
    affectedMaleFrequency: input.recessiveAlleleFrequency as number,
  }),
});
export const runXLinkedHardyWeinberg = xLinkedHardyWeinbergTool.execute;
export default xLinkedHardyWeinbergTool;
