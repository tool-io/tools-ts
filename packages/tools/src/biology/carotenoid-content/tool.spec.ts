import { describe, expect, it } from "vitest";
import { carotenoidContentExample, runCarotenoidContent } from "./tool.js";

describe("Carotenoid Content", () => {
  it("publishes an executable example", () =>
    expect(runCarotenoidContent(carotenoidContentExample.input)).toEqual({
      ok: true,
      output: carotenoidContentExample.output,
    }));
  it("returns zero content for zero absorbance", () =>
    expect(
      runCarotenoidContent({ absorbance480: 0, leafFreshMassG: 0.5 }),
    ).toEqual({ ok: true, output: { carotenoidsUgPerG: 0 } }));
  it("scales inversely with fresh mass", () =>
    expect(
      runCarotenoidContent({ absorbance480: 0.4, leafFreshMassG: 2 }),
    ).toEqual({ ok: true, output: { carotenoidsUgPerG: 0.8 } }));
  it("rejects negative absorbance", () =>
    expect(
      runCarotenoidContent({ absorbance480: -0.1, leafFreshMassG: 1 }).ok,
    ).toBe(false));
  it("rejects zero fresh mass", () =>
    expect(
      runCarotenoidContent({ absorbance480: 0.35, leafFreshMassG: 0 }).ok,
    ).toBe(false));
});
