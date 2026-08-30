import { describe, expect, it } from "vitest";
import {
  lookupTrizInventivePrinciple,
  runTrizPrinciple,
  trizPrincipleExample,
} from "./tool.js";

describe("TRIZ contradiction matrix 40 principles lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runTrizPrinciple(trizPrincipleExample.input)).toEqual({
      ok: true,
      output: trizPrincipleExample.output,
    });
  });

  it("looks up principle fourteen", () => {
    expect(
      lookupTrizInventivePrinciple({ principleNumber: 14 }).principleName,
    ).toBe("Feedback");
  });

  it("looks up principle forty", () => {
    expect(
      lookupTrizInventivePrinciple({ principleNumber: 40 }).applicationGuidance,
    ).toContain("Increase");
  });

  it("rejects a principle number above forty", () => {
    expect(runTrizPrinciple({ principleNumber: 41 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "principleNumber" }],
      },
      ok: false,
    });
  });
});
