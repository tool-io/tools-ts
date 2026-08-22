import { describe, expect, it } from "vitest";
import { minimumSinkSpeedExample, runMinimumSinkSpeed } from "./tool.js";
describe("minimum sink speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runMinimumSinkSpeed(minimumSinkSpeedExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.minimumSinkKt).toBeCloseTo(
      minimumSinkSpeedExample.output.minimumSinkKt,
      9,
    );
  });
});
