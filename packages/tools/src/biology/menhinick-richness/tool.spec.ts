import { describe, expect, it } from "vitest";
import { menhinickRichnessExample, runMenhinickRichness } from "./tool.js";

describe("Menhinick Richness", () => {
  it("publishes an executable example", () =>
    expect(runMenhinickRichness(menhinickRichnessExample.input)).toEqual({
      ok: true,
      output: menhinickRichnessExample.output,
    }));
  it("calculates a valid result", () =>
    expect(
      runMenhinickRichness({ individualsInt: 100, speciesCountInt: 4 }),
    ).toEqual({ ok: true, output: { menhinickIndex: 0.4 } }));
  it("yields the count for a single individual", () =>
    expect(
      runMenhinickRichness({ individualsInt: 1, speciesCountInt: 1 }),
    ).toEqual({ ok: true, output: { menhinickIndex: 1 } }));
  it("drops as individuals accumulate", () =>
    expect(
      runMenhinickRichness({
        individualsInt: 400,
        speciesCountInt: 4,
      }),
    ).toEqual({ ok: true, output: { menhinickIndex: 0.2 } }));
  it("rejects zero species", () =>
    expect(
      runMenhinickRichness({ individualsInt: 100, speciesCountInt: 0 }).ok,
    ).toBe(false));
  it("rejects zero individuals", () =>
    expect(
      runMenhinickRichness({ individualsInt: 0, speciesCountInt: 4 }).ok,
    ).toBe(false));
  it("rejects fractional counts", () =>
    expect(
      runMenhinickRichness({ individualsInt: 10.5, speciesCountInt: 4 }).ok,
    ).toBe(false));
});
