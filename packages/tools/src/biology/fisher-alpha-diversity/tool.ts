import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const fisherAlphaExample = {
  input: { individualCountInt: 100, speciesCountInt: 10 },
  output: { fisherAlpha: 2.7662896633569414 },
} satisfies ToolExample<
  { readonly individualCountInt: number; readonly speciesCountInt: number },
  { readonly fisherAlpha: number }
>;

export const fisherAlphaTool = createSimpleTool({
  id: "biology/fisher-alpha-diversity",
  title: "Fisher Alpha",
  description:
    "Solve Fisher's log-series diversity parameter from S = alpha × ln(1 + N/alpha). A finite positive solution exists when the observed species count is smaller than the individual count.",
  inputs: [
    {
      id: "speciesCountInt",
      label: "Species count S",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "individualCountInt",
      label: "Individual count N",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "fisherAlpha",
      label: "Fisher alpha",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const speciesCountInt = input.speciesCountInt as number;
    const individualCountInt = input.individualCountInt as number;
    if (speciesCountInt >= individualCountInt)
      simpleError(
        "speciesCountInt",
        "Species count must be smaller than the individual count for a finite Fisher alpha.",
        "degenerate_input",
      );
    const residual = (alpha: number): number =>
      alpha * Math.log1p(individualCountInt / alpha) - speciesCountInt;
    let low = 0;
    let high = Math.max(1, individualCountInt);
    while (residual(high) < 0 && Number.isFinite(high)) high *= 2;
    if (!Number.isFinite(high))
      simpleError(
        "individualCountInt",
        "A finite Fisher alpha could not be bracketed for these counts.",
        "degenerate_input",
      );
    for (let iteration = 0; iteration < 80; iteration += 1) {
      const mid = (low + high) / 2;
      if (residual(mid) < 0) low = mid;
      else high = mid;
    }
    return { fisherAlpha: (low + high) / 2 };
  },
});
export const runFisherAlpha = fisherAlphaTool.execute;
export default fisherAlphaTool;
