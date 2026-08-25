import { describe, expect, it } from "vitest";
import {
  runSporeShapeQQuotientRater,
  sporeShapeQQuotientRaterExample,
} from "./tool.js";

describe("Q Quotient Rater", () => {
  it("matches the canonical example", () => {
    expect(
      runSporeShapeQQuotientRater(sporeShapeQQuotientRaterExample.input),
    ).toEqual({
      ok: true,
      output: sporeShapeQQuotientRaterExample.output,
    });
  });
  it("calculates a quotient near one", () =>
    expect(runSporeShapeQQuotientRater({ lengthUm: 11, widthUm: 10 })).toEqual({
      ok: true,
      output: { q: 1.1 },
    }));
  it("calculates fractional quotients", () =>
    expect(
      runSporeShapeQQuotientRater({ lengthUm: 12.5, widthUm: 10 }),
    ).toEqual({
      ok: true,
      output: { q: 1.25 },
    }));
  it("calculates a quotient of one and a half", () =>
    expect(runSporeShapeQQuotientRater({ lengthUm: 15, widthUm: 10 })).toEqual({
      ok: true,
      output: { q: 1.5 },
    }));
  it("calculates a quotient of two", () =>
    expect(runSporeShapeQQuotientRater({ lengthUm: 20, widthUm: 10 })).toEqual({
      ok: true,
      output: { q: 2 },
    }));
  it("does not infer outline from a quotient above 2.5", () =>
    expect(runSporeShapeQQuotientRater({ lengthUm: 30, widthUm: 10 })).toEqual({
      ok: true,
      output: { q: 3 },
    }));
  it("rejects zero width", () =>
    expect(runSporeShapeQQuotientRater({ lengthUm: 9, widthUm: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative measurements", () =>
    expect(runSporeShapeQQuotientRater({ lengthUm: -5, widthUm: 4 }).ok).toBe(
      false,
    ));
});
