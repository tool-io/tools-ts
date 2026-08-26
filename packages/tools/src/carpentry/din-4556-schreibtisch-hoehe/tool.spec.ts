import { describe, expect, it } from "vitest";
import { runDin4556DeskHeight, din4556DeskHeightExample } from "./tool.js";

const run = runDin4556DeskHeight;

describe("DIN 4556 Desk Height Lookup", () => {
  it("reproduces its canonical example exactly", () =>
    expect(run(din4556DeskHeightExample.input)).toEqual({
      ok: true,
      output: din4556DeskHeightExample.output,
    }));

  it("maps fixed desks to the 680 mm work height only", () =>
    expect(run({ deskClass: "fixed" })).toEqual({
      ok: true,
      output: { workHeightMm: 680 },
    }));

  it("maps adjustable desks to the work height and an 80 mm range", () =>
    expect(run({ deskClass: "adjustable" })).toEqual({
      ok: true,
      output: { adjustmentRangeMm: 80, workHeightMm: 680 },
    }));

  it("returns no adjustment range for fixed desks", () => {
    const result = run({ deskClass: "fixed" });
    expect(result.ok).toBe(true);
    if (result.ok) expect("adjustmentRangeMm" in result.output).toBe(false);
  });

  it("keeps the standard work height for both classes", () => {
    for (const deskClass of ["fixed", "adjustable"] as const) {
      const result = run({ deskClass });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.workHeightMm).toBe(680);
    }
  });

  it("rejects an unlisted class with invalid_field", () => {
    const result = run({ deskClass: "standing" as never });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a non-string class with invalid_field", () => {
    const result = run({ deskClass: 1 as never });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a missing class with invalid_field", () => {
    const result = run({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () =>
    expect(run({ deskClass: "fixed", extra: 1 } as never).ok).toBe(false));
});
