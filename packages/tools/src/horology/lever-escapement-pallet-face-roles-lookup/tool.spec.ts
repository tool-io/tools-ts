import { describe, expect, it } from "vitest";
import {
  lookupLeverPalletFaceRole,
  palletFaceExample,
  runPalletFace,
} from "./tool.js";

describe("lever escapement pallet-face roles lookup", () => {
  it("reproduces the canonical locking-face example", () => {
    expect(runPalletFace(palletFaceExample.input)).toEqual({
      ok: true,
      output: palletFaceExample.output,
    });
  });

  it("covers the impulse face", () => {
    expect(lookupLeverPalletFaceRole({ palletFace: "impulse" })).toMatchObject({
      objective:
        "Transfer escape-wheel energy to the lever and balance during the impulse phase.",
      role: "Impulse face",
    });
  });

  it("rejects a universal numeric angle claim", () => {
    expect(
      lookupLeverPalletFaceRole({ palletFace: "locking" }).specificationCaution,
    ).toContain("not a universal fixed angle");
  });

  it("rejects an unsupported pallet face at the public boundary", () => {
    expect(runPalletFace({ palletFace: "draw" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "palletFace" }] },
      ok: false,
    });
  });
});
