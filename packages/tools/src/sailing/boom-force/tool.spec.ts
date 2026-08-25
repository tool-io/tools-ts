import { describe, expect, it } from "vitest";
import { boomForceExample, runBoomForce } from "./tool.js";

describe("boom force calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBoomForce(boomForceExample.input)).toEqual({
      ok: true,
      output: boomForceExample.output,
    });
  });

  it("doubles the force when the attachment height halves", () => {
    const high = runBoomForce({
      attachmentHeightMeters: 2,
      boomLengthMeters: 3,
      sheetTensionNewtons: 600,
    });
    expect(high).toEqual({ ok: true, output: { boomForceNewtons: 900 } });
    expect(
      runBoomForce({
        attachmentHeightMeters: 1,
        boomLengthMeters: 3,
        sheetTensionNewtons: 600,
      }),
    ).toEqual({ ok: true, output: { boomForceNewtons: 1800 } });
  });

  it("scales linearly with sheet tension", () => {
    expect(
      runBoomForce({
        attachmentHeightMeters: 1.5,
        boomLengthMeters: 4,
        sheetTensionNewtons: 600,
      }),
    ).toEqual({ ok: true, output: { boomForceNewtons: 1600 } });
  });

  it("rejects zero sheet tension with the stable code", () => {
    const result = runBoomForce({
      attachmentHeightMeters: 1.5,
      boomLengthMeters: 4,
      sheetTensionNewtons: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_tension");
  });

  it("rejects zero boom length", () => {
    expect(
      runBoomForce({
        attachmentHeightMeters: 1.5,
        boomLengthMeters: 0,
        sheetTensionNewtons: 300,
      }).ok,
    ).toBe(false);
  });

  it("rejects zero attachment height with the stable code", () => {
    const result = runBoomForce({
      attachmentHeightMeters: 0,
      boomLengthMeters: 4,
      sheetTensionNewtons: 300,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_height");
  });

  it("rejects negative inputs", () => {
    expect(
      runBoomForce({
        attachmentHeightMeters: -1.5,
        boomLengthMeters: 4,
        sheetTensionNewtons: 300,
      }).ok,
    ).toBe(false);
  });

  it("requires all three inputs", () => {
    expect(
      runBoomForce({ boomLengthMeters: 4, sheetTensionNewtons: 300 }).ok,
    ).toBe(false);
  });

  it("computes a realistic offshore load", () => {
    expect(
      runBoomForce({
        attachmentHeightMeters: 0.8,
        boomLengthMeters: 4.5,
        sheetTensionNewtons: 1800,
      }),
    ).toEqual({ ok: true, output: { boomForceNewtons: 10125 } });
  });
});
