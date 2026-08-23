import { describe, expect, it } from "vitest";
import { runMacAddressNormalizer } from "./tool.js";

describe("MAC Address Normalizer", () => {
  it("calculates a valid result", () => {
    const result = runMacAddressNormalizer({ macAddress: "00:1A:2B:3C:4D:5E" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.normalized).toBe("00:1a:2b:3c:4d:5e");
  });
  it("rejects invalid input", () =>
    expect(runMacAddressNormalizer(null).ok).toBe(false));
});
