import { describe, expect, it } from "vitest";
import { runRailFenceEncode } from "../../encode/rail-fence/tool.js";
import { runRailFenceDecode } from "./tool.js";

describe("Rail Fence Decoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRailFenceDecode({ cipher: "Horel ollwd", rails: 3 })).toEqual({
      ok: true,
      output: { text: "Hello world" },
    });
  });

  it("round-trips several texts and rail counts", () => {
    const cases = [
      { rails: 2, text: "the quick brown fox" },
      { rails: 3, text: "Hello world" },
      { rails: 4, text: "Rail fence cipher round trip!" },
      { rails: 5, text: "abc" },
      { rails: 3, text: "x" },
    ];
    for (const { rails, text } of cases) {
      const encoded = runRailFenceEncode({ rails, text });
      if (!encoded.ok) throw new Error("expected success");
      const decoded = runRailFenceDecode({
        cipher: encoded.output.cipher,
        rails,
      });
      expect(decoded).toEqual({ ok: true, output: { text } });
    }
  });

  it("rejects single-rail input through execution", () => {
    expect(runRailFenceDecode({ cipher: "abc", rails: 1 }).ok).toBe(false);
  });

  it("rejects invalid input", () =>
    expect(runRailFenceDecode(null).ok).toBe(false));
});
