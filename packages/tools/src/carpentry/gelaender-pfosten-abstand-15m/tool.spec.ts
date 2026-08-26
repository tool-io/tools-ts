import { describe, expect, it } from "vitest";
import { postSpacingExample, runPostSpacing } from "./tool.js";

describe("Post Spacing Calculator", () => {
  it("computes the canonical example with the default maximum spacing", () =>
    expect(runPostSpacing(postSpacingExample.input)).toEqual({
      ok: true,
      output: { actualSpacingM: 1.5, postsRequired: 11 },
    }));

  it("divides a fifteen meter run exactly with an explicit spacing", () =>
    expect(runPostSpacing({ runLengthM: 15, maxPostSpacingM: 2.5 })).toEqual({
      ok: true,
      output: { actualSpacingM: 2.5, postsRequired: 7 },
    }));

  it("rounds up and tightens the actual spacing", () =>
    expect(runPostSpacing({ runLengthM: 10 })).toEqual({
      ok: true,
      output: { actualSpacingM: 1.4285714285714286, postsRequired: 8 },
    }));

  it("needs two posts for very short runs", () =>
    expect(runPostSpacing({ runLengthM: 0.3 })).toEqual({
      ok: true,
      output: { actualSpacingM: 0.3, postsRequired: 2 },
    }));

  it("accepts an explicit maximum spacing just below three meters", () =>
    expect(runPostSpacing({ runLengthM: 3, maxPostSpacingM: 2.9 })).toEqual({
      ok: true,
      output: { actualSpacingM: 1.5, postsRequired: 3 },
    }));

  it("supports dense spacing on longer runs", () =>
    expect(runPostSpacing({ runLengthM: 7.5, maxPostSpacingM: 0.75 })).toEqual({
      ok: true,
      output: { actualSpacingM: 0.75, postsRequired: 11 },
    }));

  it("rejects a zero run length", () => {
    const result = runPostSpacing({ runLengthM: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "runLengthM",
        message: "Run length must be greater than zero.",
      });
  });

  it("rejects negative run lengths", () =>
    expect(runPostSpacing({ runLengthM: -15 }).ok).toBe(false));

  it("rejects a zero maximum spacing", () => {
    const result = runPostSpacing({ runLengthM: 15, maxPostSpacingM: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("must_be_positive");
  });

  it("rejects a maximum spacing at the exclusive upper bound of three", () => {
    const result = runPostSpacing({ runLengthM: 15, maxPostSpacingM: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "out_of_range",
        field: "maxPostSpacingM",
        message: "Maximum post spacing must be less than three meters.",
      });
  });

  it("rejects maximum spacings above three meters", () =>
    expect(runPostSpacing({ runLengthM: 15, maxPostSpacingM: 3.1 }).ok).toBe(
      false,
    ));

  it("rejects a missing run length", () => {
    const result = runPostSpacing({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("runLengthM");
  });

  it("rejects unknown input fields", () => {
    const result = runPostSpacing({
      postsRequired: 11,
      runLengthM: 15,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
