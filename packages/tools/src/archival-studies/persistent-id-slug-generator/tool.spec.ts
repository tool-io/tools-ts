import { describe, expect, it } from "vitest";
import {
  calculatePersistentIdSlugGenerator,
  persistentIdSlugGeneratorExample,
  runPersistentIdSlugGenerator,
} from "./tool.js";

describe("archival-studies/persistent-id-slug-generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPersistentIdSlugGenerator(persistentIdSlugGeneratorExample.input),
    ).toEqual({ ok: true, output: persistentIdSlugGeneratorExample.output });
  });

  it("folds accents and truncates on a word boundary", () => {
    expect(
      calculatePersistentIdSlugGenerator({ title: "Café Culture" }),
    ).toEqual({
      slug: "cafe-culture",
    });
    expect(
      calculatePersistentIdSlugGenerator({
        title: "Records of the Advisory Committee on Very Long Committee Names",
        maxLength: 30,
      }).slug.endsWith("-"),
    ).toBe(false);
  });

  it("rejects titles that produce no slug and short maximum lengths", () => {
    expect(runPersistentIdSlugGenerator({ title: "   !!!   " }).ok).toBe(false);
    expect(
      runPersistentIdSlugGenerator({ title: "Guide", maxLength: 5 }).ok,
    ).toBe(false);
  });
});
