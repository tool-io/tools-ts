import { describe, expect, it } from "vitest";
import {
  brownWhiteRotSignatureClassifierExample,
  runBrownWhiteRotSignatureClassifier,
} from "./tool.js";

describe("Rot Signature Classifier", () => {
  it("matches the canonical example", () =>
    expect(
      runBrownWhiteRotSignatureClassifier(
        brownWhiteRotSignatureClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: brownWhiteRotSignatureClassifierExample.output,
    }));
  it("maps every signature to its rot type", () => {
    const expected: Record<string, string> = {
      "brown-cubical": "brown-rot",
      "white-fibrous": "white-rot",
      "soft-rot": "soft-rot",
      "white-pocket": "white-rot",
    };
    for (const [signature, rotType] of Object.entries(expected)) {
      const result = runBrownWhiteRotSignatureClassifier({ signature });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.output.rotSignature).toBe(signature);
        expect(result.output.rotType).toBe(rotType);
        expect(result.output.interpretation).toEqual(expect.any(String));
      }
    }
  });
  it("groups both white signatures under white-rot", () => {
    const fibrous = runBrownWhiteRotSignatureClassifier({
      signature: "white-fibrous",
    });
    const pocket = runBrownWhiteRotSignatureClassifier({
      signature: "white-pocket",
    });
    expect(fibrous.ok && pocket.ok).toBe(true);
    if (fibrous.ok && pocket.ok)
      expect(fibrous.output.rotType).toBe(pocket.output.rotType);
  });
  it("keeps soft-rot distinct from the other types", () => {
    const soft = runBrownWhiteRotSignatureClassifier({ signature: "soft-rot" });
    expect(soft.ok).toBe(true);
    if (soft.ok) expect(soft.output.rotType).toBe("soft-rot");
  });
  it("rejects signatures outside the enum", () =>
    expect(
      runBrownWhiteRotSignatureClassifier({ signature: "blue-stain" }).ok,
    ).toBe(false));
});
