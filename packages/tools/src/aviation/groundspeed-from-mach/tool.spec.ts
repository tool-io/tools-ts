import { describe, expect, it } from "vitest";
import { groundspeedFromMachExample, runGroundspeedFromMach } from "./tool.js";
describe("groundspeed from mach", () => {
  it("reproduces its canonical example", () => {
    const r = runGroundspeedFromMach(groundspeedFromMachExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.groundSpeedKt).toBeGreaterThan(400);
  });
  it("rejects negative mach through execution", () => {
    expect(runGroundspeedFromMach({ mach: -1, oatC: 15 }).ok).toBe(false);
  });
});
