import { describe, expect, it } from "vitest";
import {
  bjtEmitterCurrentExample,
  calculateBjtEmitterCurrent,
  runBjtEmitterCurrent,
} from "./tool.js";

describe("BJT Emitter Current", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBjtEmitterCurrent(bjtEmitterCurrentExample.input)).toEqual({
      ok: true,
      output: bjtEmitterCurrentExample.output,
    });
  });

  it("rejects missing base current", () => {
    expect(runBjtEmitterCurrent({ collectorCurrentA: 0.001 }).ok).toBe(false);
  });

  it("equals the sum of base and collector currents for any split", () => {
    expect(
      calculateBjtEmitterCurrent({
        baseCurrentA: 0.00002,
        collectorCurrentA: 0.002,
      }).emitterCurrentA,
    ).toBe(0.00202);
  });
});
