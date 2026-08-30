import { describe, expect, it } from "vitest";
import {
  lookupSpringBarStrapChangeSafety,
  runSpringBarSafety,
  springBarSafetyExample,
} from "./tool.js";

describe("spring-bar strap-change safety lookup", () => {
  it("reproduces the canonical identification example", () => {
    expect(runSpringBarSafety(springBarSafetyExample.input)).toEqual({
      ok: true,
      output: {
        keyConcern: springBarSafetyExample.output.keyConcern,
        safetyFocus: springBarSafetyExample.output.safetyFocus,
        step: springBarSafetyExample.output.step,
      },
    });
  });

  it("requires a stable soft preparation surface", () => {
    expect(
      lookupSpringBarStrapChangeSafety({ safetyFocus: "preparation" })
        .keyConcern,
    ).toContain("soft, stable surface");
  });

  it("warns about force and tool slippage", () => {
    expect(
      lookupSpringBarStrapChangeSafety({ safetyFocus: "forceControl" })
        .keyConcern,
    ).toContain("slipping tool");
  });

  it("requires spring-bar condition inspection", () => {
    expect(
      lookupSpringBarStrapChangeSafety({ safetyFocus: "springBarCondition" })
        .keyConcern,
    ).toContain("Do not reuse");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runSpringBarSafety({ safetyFocus: "lubrication" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "safetyFocus" }] },
      ok: false,
    });
  });
});
