import { describe, expect, it } from "vitest";
import {
  runTransformerEfficiency,
  transformerEfficiencyExample,
} from "./tool.js";
describe("Transformer Efficiency", () => {
  it("publishes an executable example", () =>
    expect(
      runTransformerEfficiency(transformerEfficiencyExample.input),
    ).toEqual({ ok: true, output: transformerEfficiencyExample.output }));
  it("allows ideal transformers", () =>
    expect(runTransformerEfficiency({ pIn: 50, pOut: 50 })).toEqual({
      ok: true,
      output: { efficiencyPercent: 100 },
    }));
  it("rejects zero input power", () =>
    expect(runTransformerEfficiency({ pIn: 0, pOut: 0 }).ok).toBe(false));
  it("rejects output exceeding input", () =>
    expect(runTransformerEfficiency({ pIn: 10, pOut: 20 }).ok).toBe(false));
});
