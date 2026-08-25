import { describe, expect, it } from "vitest";
import {
  lifestyleGuildClassifierExample,
  runLifestyleGuildClassifier,
} from "./tool.js";

describe("Guild Classifier", () => {
  it("matches the canonical example", () =>
    expect(
      runLifestyleGuildClassifier(lifestyleGuildClassifierExample.input),
    ).toEqual({ ok: true, output: lifestyleGuildClassifierExample.output }));
  it("records every supported guild without inventing a trophic mode", () => {
    const guilds = [
      "ectomycorrhizal",
      "saprotrophic",
      "pathogenic",
      "parasitic",
      "lichenized",
      "entomopathogenic",
    ];
    for (const guild of guilds)
      expect(runLifestyleGuildClassifier({ guild })).toEqual({
        ok: true,
        output: { guild },
      });
  });
  it("echoes the guild in the output", () => {
    const result = runLifestyleGuildClassifier({ guild: "lichenized" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.guild).toBe("lichenized");
  });
  it("rejects guilds outside the enum", () =>
    expect(runLifestyleGuildClassifier({ guild: "aquatic" }).ok).toBe(false));
});
