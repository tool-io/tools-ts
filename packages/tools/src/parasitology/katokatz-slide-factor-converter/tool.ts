import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const katokatzSlideFactorConverterExample = {
  input: { eggsOnSlideInt: 10 },
} satisfies ToolExample<{
  readonly eggsOnSlideInt: number;
  readonly templateFactorInt?: number;
}>;

export const katokatzSlideFactorConverterTool = createSimpleTool({
  id: "parasitology/katokatz-slide-factor-converter",
  title: "Kato-Katz Factor Converter",
  description:
    "Convert Kato-Katz slide egg counts to eggs per gram using the template factor; the standard forty one point seven milligram template gives a multiplication factor of twenty four.",
  inputs: [
    {
      id: "eggsOnSlideInt",
      label: "Eggs on slide",
      kind: "integer",
      minimum: 0,
    },
    {
      default: 24,
      id: "templateFactorInt",
      label: "Template factor",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [{ id: "eggsPerGram", label: "Eggs per gram", kind: "number" }],
  calculate: (input) => ({
    eggsPerGram:
      (input.eggsOnSlideInt as number) * (input.templateFactorInt as number),
  }),
});
export const runKatokatzSlideFactorConverter =
  katokatzSlideFactorConverterTool.execute;
export default katokatzSlideFactorConverterTool;
