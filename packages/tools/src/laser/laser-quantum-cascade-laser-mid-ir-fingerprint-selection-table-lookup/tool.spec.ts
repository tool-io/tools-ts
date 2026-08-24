import { describe, expect, it } from "vitest";
import {
  qclGasFingerprintExample as example,
  runQclGasFingerprint,
} from "./tool.js";
describe("QCL gas fingerprint lookup", () => {
  it("returns the selected gas window", () =>
    expect(runQclGasFingerprint(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects unsupported gases", () =>
    expect(runQclGasFingerprint({ gasId: "argon" }).ok).toBe(false));
});
