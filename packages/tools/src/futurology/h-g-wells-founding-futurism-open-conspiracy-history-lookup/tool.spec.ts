import { describe, expect, it } from "vitest";
import {
  hgWellsFoundingFuturismExample,
  lookupHgWellsFoundingFuturism,
  runHgWellsFoundingFuturism,
} from "./tool.js";

describe("H G Wells founding futurism history lookup", () => {
  it("reproduces its canonical example", () => {
    expect(
      runHgWellsFoundingFuturism(hgWellsFoundingFuturismExample.input),
    ).toEqual({
      ok: true,
      output: hgWellsFoundingFuturismExample.output,
    });
  });

  it("looks up practice", () => {
    expect(
      lookupHgWellsFoundingFuturism({ focus: "practice" }).historyEntry,
    ).toContain("test them against evidence");
  });

  it("looks up legacy", () => {
    expect(
      lookupHgWellsFoundingFuturism({ focus: "legacy" }).historyEntry,
    ).toContain("speculative fiction");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runHgWellsFoundingFuturism({ focus: "biography" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "focus" }] },
      ok: false,
    });
  });
});
