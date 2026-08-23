import { describe, expect, it } from "vitest";
import { deltaE76Example, calculateDeltaE76, runDeltaE76 } from "./tool.js";

describe("color/delta-e-76", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDeltaE76(deltaE76Example.input)).toEqual({
      ok: true,
      output: deltaE76Example.output,
    });
  });
  it("rejects invalid input (invalid_color)", () => {
    expect(runDeltaE76({ colorA: "red", colorB: "#0000ff" }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_color)", () => {
    expect(runDeltaE76({ colorA: "#ff0000", colorB: "#12345" }).ok).toBe(false);
  });
  it("reports identical colors as zero difference", () => {
    const result = runDeltaE76({ colorA: "#3a7", colorB: "#33aa77" });
    expect(result.ok && result.output.deltaE76).toBe(0);
  });
});
