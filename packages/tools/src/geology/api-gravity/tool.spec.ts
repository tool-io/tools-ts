import { describe, expect, it } from "vitest";
import { apiGravityExample, runApiGravity } from "./tool.js";

describe("api-gravity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runApiGravity(apiGravityExample.input)).toEqual({
      ok: true,
      output: apiGravityExample.output,
    });
  });

  it("returns ten for water-weight crude", () => {
    const result = runApiGravity({ specificGravity: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.apiGravity as number).toBe(10);
  });
  it("rejects non-positive gravities", () => {
    expect(runApiGravity({ specificGravity: 0 }).ok).toBe(false);
  });
});
