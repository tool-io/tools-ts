import { describe, expect, it } from "vitest";
import { vySpeedExample, runVySpeed } from "./tool.js";
describe("vy speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runVySpeed(vySpeedExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.vyKt).toBeCloseTo(vySpeedExample.output.vyKt, 9);
  });
});
