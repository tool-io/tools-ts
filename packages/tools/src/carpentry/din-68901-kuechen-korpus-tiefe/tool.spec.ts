import { describe, expect, it } from "vitest";
import {
  runDin68901KitchenCarcaseDepth,
  din68901KitchenCarcaseDepthExample,
} from "./tool.js";

const run = runDin68901KitchenCarcaseDepth;

describe("DIN 68901 Carcase Depth Lookup", () => {
  it("reproduces its canonical example exactly", () =>
    expect(run(din68901KitchenCarcaseDepthExample.input)).toEqual({
      ok: true,
      output: din68901KitchenCarcaseDepthExample.output,
    }));

  it("maps the slim class to 450 mm", () =>
    expect(run({ depthClass: "slim" })).toEqual({
      ok: true,
      output: { nominalDepthMm: 450 },
    }));

  it("maps the standard class to 550 mm", () =>
    expect(run({ depthClass: "standard" })).toEqual({
      ok: true,
      output: { nominalDepthMm: 550 },
    }));

  it("maps the deep class to 650 mm", () =>
    expect(run({ depthClass: "deep" })).toEqual({
      ok: true,
      output: { nominalDepthMm: 650 },
    }));

  it("resolves every declared enum class", () => {
    const nominalDepths = { deep: 650, slim: 450, standard: 550 };
    for (const depthClass of ["slim", "standard", "deep"] as const) {
      const result = run({ depthClass });
      expect(result.ok).toBe(true);
      if (result.ok)
        expect(result.output.nominalDepthMm).toBe(nominalDepths[depthClass]);
    }
  });

  it("keeps a uniform 100 mm step between neighboring classes", () => {
    const depths = ["slim", "standard", "deep"].map((depthClass) => {
      const result = run({ depthClass });
      return result.ok ? Number(result.output.nominalDepthMm) : 0;
    });
    expect((depths[1] ?? 0) - (depths[0] ?? 0)).toBe(
      (depths[2] ?? 0) - (depths[1] ?? 0),
    );
  });

  it("rejects an unlisted class with invalid_field", () => {
    const result = run({ depthClass: "extra" as never });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a non-string class with invalid_field", () => {
    const result = run({ depthClass: true as never });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a missing class with invalid_field", () => {
    const result = run({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () =>
    expect(run({ depthClass: "slim", extra: 1 } as never).ok).toBe(false));
});
