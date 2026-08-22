import { describe, expect, it } from "vitest";
import { runBaconCipherDecode } from "./tool.js";
describe("bacon cipher decoder", () => {
  it("decodes two groups", () => {
    const r = runBaconCipherDecode({
      encoded: "aabbb abaaa",
      oneSym: "b",
      zeroSym: "a",
    });
    if (!r.ok) throw new Error("expected success");
    expect((r.output.text as string).length).toBe(2);
  });
  it("rejects wrong-length groups through execution", () => {
    expect(runBaconCipherDecode({ encoded: "abc" }).ok).toBe(false);
  });
});
