import { describe, expect, it } from "vitest";
import {
  OBSERVED_FORMS,
  pseudohyphaeTransitionDiscriminatorExample,
  runPseudohyphaeTransitionDiscriminator,
} from "./tool.js";

describe("Pseudohyphae Discriminator", () => {
  it("matches the canonical example", () =>
    expect(
      runPseudohyphaeTransitionDiscriminator(
        pseudohyphaeTransitionDiscriminatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: pseudohyphaeTransitionDiscriminatorExample.output,
    }));
  it("passes budding-yeast-only through unchanged", () =>
    expect(
      runPseudohyphaeTransitionDiscriminator({ form: "budding-yeast-only" }),
    ).toEqual({ ok: true, output: { morphologyClass: "budding-yeast-only" } }));
  it("passes pseudohyphal through unchanged", () =>
    expect(
      runPseudohyphaeTransitionDiscriminator({ form: "pseudohyphal" }),
    ).toEqual({ ok: true, output: { morphologyClass: "pseudohyphal" } }));
  it("passes true-hyphal through unchanged", () =>
    expect(
      runPseudohyphaeTransitionDiscriminator({ form: "true-hyphal" }),
    ).toEqual({ ok: true, output: { morphologyClass: "true-hyphal" } }));
  it("covers the whole enum", () => {
    for (const form of OBSERVED_FORMS) {
      const result = runPseudohyphaeTransitionDiscriminator({ form });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.morphologyClass).toBe(form);
    }
  });
  it("rejects forms outside the enum", () =>
    expect(
      runPseudohyphaeTransitionDiscriminator({ form: "germinating" }).ok,
    ).toBe(false));
});
