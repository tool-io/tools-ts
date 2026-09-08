export * from "../neuroscience/batch47-shared.js";
import { basalMetabolicRateKleiberTool } from "../biology/basal-metabolic-rate-kleiber/tool.js";
import { simpleError } from "../core/simple.js";
export const kleiber = (input: {
  readonly bodyMassKg: number;
}): { basalMetabolicRateKcal: number } => {
  const result = basalMetabolicRateKleiberTool.execute(input);
  if (!result.ok)
    return simpleError(
      "mass",
      "Existing Kleiber reference calculation rejected input.",
    );
  return {
    basalMetabolicRateKcal: result.output.basalMetabolicRateKcal as number,
  };
};
