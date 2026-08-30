import { describe, expect, it } from "vitest";
import {
  assessCryonicsInformationThreshold,
  cryonicsInformationThresholdExample,
  runCryonicsInformationThreshold,
} from "./tool.js";

describe("cryonics information-theoretic threshold lookup", () => {
  it("reproduces its canonical example", () => {
    expect(
      runCryonicsInformationThreshold(
        cryonicsInformationThresholdExample.input,
      ),
    ).toEqual({
      ok: true,
      output: cryonicsInformationThresholdExample.output,
    });
  });

  it("reports a met custom threshold", () => {
    expect(
      assessCryonicsInformationThreshold({
        recoverableInformationBits: 90,
        requiredInformationBits: 90,
        storedInformationBits: 100,
      }).thresholdMet,
    ).toBe(true);
  });

  it("keeps the recovery caution explicit", () => {
    expect(
      assessCryonicsInformationThreshold({
        recoverableInformationBits: 50,
        requiredInformationBits: 50,
        storedInformationBits: 100,
      }).caution,
    ).toContain("not a validated threshold");
  });

  it("rejects recoverable information above stored information", () => {
    expect(
      runCryonicsInformationThreshold({
        recoverableInformationBits: 101,
        requiredInformationBits: 50,
        storedInformationBits: 100,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "recoverable_information_exceeds_stored",
            field: "recoverableInformationBits",
          },
        ],
      },
      ok: false,
    });
  });
});
