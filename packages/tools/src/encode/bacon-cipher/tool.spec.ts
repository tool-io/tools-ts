import { describe, expect, it } from "vitest";
import { runBaconCipherEncode } from "./tool.js";
describe("bacon cipher encoder", () => {
  it("encodes two letters into ten symbols", () => {
    const r = runBaconCipherEncode({ oneSym: "b", text: "Hi", zeroSym: "a" });
    if (!r.ok) throw new Error("expected success");
    expect((r.output.encoded as string).split(" ").length).toBe(2);
  });
});
