import { describe, expect, it } from "vitest";
import {
  runWheatstoneBridgeBalance,
  wheatstoneBridgeBalanceExample,
} from "./tool.js";

describe("Bridge Balance Check", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWheatstoneBridgeBalance(wheatstoneBridgeBalanceExample.input),
    ).toEqual({
      ok: true,
      output: wheatstoneBridgeBalanceExample.output,
    });
  });

  it("accepts proportional opposite arms as balanced", () => {
    expect(
      runWheatstoneBridgeBalance({
        r1Ohms: 100,
        r2Ohms: 200,
        r3Ohms: 150,
        r4Ohms: 300,
      }),
    ).toEqual({ ok: true, output: { balanced: true } });
  });

  it("reports an unbalanced bridge as false", () => {
    const result = runWheatstoneBridgeBalance({
      r1Ohms: 1000,
      r2Ohms: 999,
      r3Ohms: 999,
      r4Ohms: 1000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.balanced).toBe(false);
  });

  it("rejects zero arm resistances", () => {
    expect(
      runWheatstoneBridgeBalance({
        r1Ohms: 0,
        r2Ohms: 1000,
        r3Ohms: 1000,
        r4Ohms: 1000,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative arm resistances", () => {
    expect(
      runWheatstoneBridgeBalance({
        r1Ohms: -1000,
        r2Ohms: 1000,
        r3Ohms: 1000,
        r4Ohms: 1000,
      }).ok,
    ).toBe(false);
  });

  it("requires all four arms", () => {
    expect(
      runWheatstoneBridgeBalance({ r1Ohms: 1, r2Ohms: 1, r3Ohms: 1 }).ok,
    ).toBe(false);
  });
});
