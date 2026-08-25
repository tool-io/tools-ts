import { describe, expect, it } from "vitest";
import {
  mycorrhizalHostPairValidatorExample,
  runMycorrhizalHostPairValidator,
} from "./tool.js";

describe("Host Pair Validator", () => {
  it("matches the canonical example", () =>
    expect(
      runMycorrhizalHostPairValidator(
        mycorrhizalHostPairValidatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: mycorrhizalHostPairValidatorExample.output,
    }));
  it("keeps original capitalisation in the pairing note", () =>
    expect(
      runMycorrhizalHostPairValidator({
        associationConfirmed: false,
        fungusGenus: "amanita",
        hostGenus: "Pinus",
      }),
    ).toEqual({
      ok: true,
      output: { pairValidated: false, pairingNote: "amanita x Pinus" },
    }));
  it("rejects self-pairing with identical spelling", () => {
    const result = runMycorrhizalHostPairValidator({
      associationConfirmed: true,
      fungusGenus: "Populus",
      hostGenus: "Populus",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("self_pairing");
  });
  it("rejects self-pairing that differs only by case", () => {
    const result = runMycorrhizalHostPairValidator({
      associationConfirmed: true,
      fungusGenus: "Tuber",
      hostGenus: "tuber",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("self_pairing");
  });
  it("rejects an empty fungus genus", () => {
    const result = runMycorrhizalHostPairValidator({
      associationConfirmed: true,
      fungusGenus: "",
      hostGenus: "Pinus",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_genus");
  });
  it("rejects an empty host genus", () => {
    const result = runMycorrhizalHostPairValidator({
      associationConfirmed: true,
      fungusGenus: "Amanita",
      hostGenus: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_genus");
  });
  it("rejects whitespace-only genera", () => {
    expect(
      runMycorrhizalHostPairValidator({
        associationConfirmed: true,
        fungusGenus: "  ",
        hostGenus: "Pinus",
      }).ok,
    ).toBe(false);
  });
  it("reports the error on the offending field", () => {
    const result = runMycorrhizalHostPairValidator({
      associationConfirmed: true,
      fungusGenus: "Amanita",
      hostGenus: "amanita",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("hostGenus");
  });
});
