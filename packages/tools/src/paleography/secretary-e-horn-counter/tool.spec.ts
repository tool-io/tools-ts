import { describe, expect, it } from "vitest";
import {
  runSecretaryEHornCounter,
  secretaryEHornCounterExample,
} from "./tool.js";

describe("secretary-e-horn-counter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSecretaryEHornCounter(secretaryEHornCounterExample.input),
    ).toEqual({
      ok: true,
      output: secretaryEHornCounterExample.output,
    });
  });

  it("reports a full horned share for pure horned-e text", () => {
    const result = runSecretaryEHornCounter({ text: "ęęę" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.hornedEShareOfEPct as number).toBe(100);
    expect(result.output.plainECount as number).toBe(0);
  });

  it("rejects text without any e glyph", () => {
    expect(runSecretaryEHornCounter({ text: "abcd" }).ok).toBe(false);
  });

  it("uses Unicode code points for the per-character rate", () => {
    const result = runSecretaryEHornCounter({ text: "😀ę" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.hornedEPerThousandCharacters).toBe(500);
  });
});
