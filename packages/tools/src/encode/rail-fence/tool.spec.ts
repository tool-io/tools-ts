import { describe, expect, it } from "vitest";
import { runRailFenceEncode } from "./tool.js";
describe("rail fence encoder", () => {
  it("encodes Hello world on three rails", () => {
    const r = runRailFenceEncode({ rails: 3, text: "Hello world" });
    if (!r.ok) throw new Error("expected success");
    expect((r.output.cipher as string).length).toBe(11);
  });
  it("rejects single-rail input through execution", () => {
    expect(runRailFenceEncode({ rails: 1, text: "abc" }).ok).toBe(false);
  });
});
