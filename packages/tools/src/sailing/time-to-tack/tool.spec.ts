import { describe, expect, it } from "vitest";
import { runTimeToTack, timeToTackExample } from "./tool.js";

describe("time to tack calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTimeToTack(timeToTackExample.input)).toEqual({
      ok: true,
      output: timeToTackExample.output,
    });
  });

  it("handles fractional distances and speeds exactly", () => {
    expect(runTimeToTack({ boatSpeedKt: 6, distanceToLaylineNm: 0.5 })).toEqual(
      { ok: true, output: { timeMinutes: 5 } },
    );
  });

  it("scales linearly with distance", () => {
    const result = runTimeToTack({ boatSpeedKt: 5, distanceToLaylineNm: 3 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.timeMinutes).toBe(36);
  });

  it("rejects zero distances through calculation and negative distances through validation", () => {
    expect(
      runTimeToTack({ boatSpeedKt: 5, distanceToLaylineNm: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "distanceToLaylineNm" }],
      },
      ok: false,
    });
    expect(
      runTimeToTack({ boatSpeedKt: 5, distanceToLaylineNm: -1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "distanceToLaylineNm" }],
      },
      ok: false,
    });
  });

  it("rejects zero speeds through calculation and negative speeds through validation", () => {
    expect(
      runTimeToTack({ boatSpeedKt: 0, distanceToLaylineNm: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "boatSpeedKt" }] },
      ok: false,
    });
    expect(
      runTimeToTack({ boatSpeedKt: -5, distanceToLaylineNm: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "boatSpeedKt" }] },
      ok: false,
    });
  });

  it("accepts tiny positive values at the practical boundary", () => {
    expect(
      runTimeToTack({ boatSpeedKt: 60, distanceToLaylineNm: 0.01 }).ok,
    ).toBe(true);
  });

  it("rejects missing and malformed inputs", () => {
    expect(runTimeToTack({}).ok).toBe(false);
    expect(
      runTimeToTack({ boatSpeedKt: "fast", distanceToLaylineNm: 1 }).ok,
    ).toBe(false);
    expect(runTimeToTack(undefined)).toMatchObject({
      error: { issues: [{ code: "object_required", field: "" }] },
      ok: false,
    });
  });
});
