import { describe, expect, it } from "vitest";
import { runQpcrDeltaDeltaCt } from "./tool.js";

describe("Delta Delta CT", () => {
  it("calculates a valid result", () =>
    expect(
      runQpcrDeltaDeltaCt({ deltaCtTreated: 1, deltaCtControl: 3 }),
    ).toEqual({
      ok: true,
      output: { deltaDeltaCt: -2 },
    }));
  it("returns positive values for upregulated targets", () =>
    expect(
      runQpcrDeltaDeltaCt({ deltaCtTreated: 5, deltaCtControl: 2 }),
    ).toEqual({
      ok: true,
      output: { deltaDeltaCt: 3 },
    }));
  it("returns zero when treated matches control", () =>
    expect(
      runQpcrDeltaDeltaCt({ deltaCtTreated: 4, deltaCtControl: 4 }),
    ).toEqual({
      ok: true,
      output: { deltaDeltaCt: 0 },
    }));
  it("rejects non-finite input", () =>
    expect(
      runQpcrDeltaDeltaCt({ deltaCtTreated: 1, deltaCtControl: Number.NaN }).ok,
    ).toBe(false));
});
