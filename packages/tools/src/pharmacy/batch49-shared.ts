export * from "../psychology/batch49-shared.js";
import mosteller from "../biology/body-surface-area-mosteller/tool.js";
import dubois from "../biology/body-surface-area-dubois/tool.js";
import { simpleError, positive } from "../psychology/batch49-shared.js";
export const matchedBsa = (
  heightCm: number,
  weightKg: number,
  method: "mosteller" | "dubois",
): number => {
  positive(heightCm, "heightCm");
  positive(weightKg, "weightKg");
  const result = (method === "mosteller" ? mosteller : dubois).execute({
    heightCm,
    weightKg,
  });
  if (!result.ok)
    return simpleError(
      "BSA",
      "Existing named BSA calculation rejected the actual observations.",
    );
  return positive(result.output.bsaM2, "actualBsaM2");
};
