import { describe, expect, it } from "vitest";
import { runCpMinusCv } from "./tool.js";

describe("Cp Minus Cv Calculator", () => {
  it("calculates a valid result", () => {
    const result = runCpMinusCv({});
    if (!result.ok) throw new Error("expected success");
    expect(result.output.cpMinusCv).toBeDefined();
  });
  it("rejects invalid input", () => expect(runCpMinusCv(null).ok).toBe(false));
});
