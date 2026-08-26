import { describe, expect, it } from "vitest";
import {
  runDin68901KitchenCarcaseHeight,
  din68901KitchenCarcaseHeightExample,
} from "./tool.js";

const run = runDin68901KitchenCarcaseHeight;

describe("DIN 68901 Carcase Height Lookup", () => {
  it("reproduces its canonical example exactly", () =>
    expect(run(din68901KitchenCarcaseHeightExample.input)).toEqual({
      ok: true,
      output: din68901KitchenCarcaseHeightExample.output,
    }));

  it("maps the low class to 575 mm", () =>
    expect(run({ sizeClass: "low" })).toEqual({
      ok: true,
      output: { nominalHeightMm: 575 },
    }));

  it("maps the base class to 720 mm", () =>
    expect(run({ sizeClass: "base" })).toEqual({
      ok: true,
      output: { nominalHeightMm: 720 },
    }));

  it("maps the tall class to 2000 mm", () =>
    expect(run({ sizeClass: "tall" })).toEqual({
      ok: true,
      output: { nominalHeightMm: 2000 },
    }));

  it("resolves every declared enum class", () => {
    const nominalHeights = { base: 720, low: 575, tall: 2000 };
    for (const sizeClass of ["low", "base", "tall"] as const) {
      const result = run({ sizeClass });
      expect(result.ok).toBe(true);
      if (result.ok)
        expect(result.output.nominalHeightMm).toBe(nominalHeights[sizeClass]);
    }
  });

  it("orders the classes low before base before tall", () => {
    const heights = ["low", "base", "tall"].map((sizeClass) => {
      const result = run({ sizeClass });
      return result.ok ? Number(result.output.nominalHeightMm) : 0;
    });
    expect(heights[0] ?? 0).toBeLessThan(heights[1] ?? 0);
    expect(heights[1] ?? 0).toBeLessThan(heights[2] ?? 0);
  });

  it("rejects an unlisted class with invalid_field", () => {
    const result = run({ sizeClass: "medium" as never });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a non-string class with invalid_field", () => {
    const result = run({ sizeClass: 720 as never });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a missing class with invalid_field", () => {
    const result = run({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () =>
    expect(run({ sizeClass: "base", extra: 1 } as never).ok).toBe(false));
});
