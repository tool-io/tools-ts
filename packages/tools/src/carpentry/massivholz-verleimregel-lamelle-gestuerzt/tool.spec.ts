import { describe, expect, it } from "vitest";
import { glueUpLamellaRuleExample, runGlueUpLamellaRule } from "./tool.js";

describe("glue-up ring alternation rule", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGlueUpLamellaRule(glueUpLamellaRuleExample.input)).toEqual({
      ok: true,
      output: glueUpLamellaRuleExample.output,
    });
  });

  it("divides below the shop cap for narrow panels", () => {
    expect(
      runGlueUpLamellaRule({ lamellaCount: 2, targetPanelWidthMm: 100 }),
    ).toEqual({
      ok: true,
      output: { flipInterval: 2, recommendedMaxLamellaWidthMm: 50 },
    });
  });

  it("caps odd lamella counts at the shop limit", () => {
    expect(
      runGlueUpLamellaRule({ lamellaCount: 3, targetPanelWidthMm: 500 }),
    ).toEqual({
      ok: true,
      output: { flipInterval: 2, recommendedMaxLamellaWidthMm: 80 },
    });
  });

  it("divides odd lamella counts under the cap", () => {
    expect(
      runGlueUpLamellaRule({ lamellaCount: 3, targetPanelWidthMm: 180 }),
    ).toEqual({
      ok: true,
      output: { flipInterval: 2, recommendedMaxLamellaWidthMm: 60 },
    });
  });

  it("accepts the two lamella boundary", () => {
    const result = runGlueUpLamellaRule({
      lamellaCount: 2,
      targetPanelWidthMm: 160,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects a single lamella", () => {
    const result = runGlueUpLamellaRule({
      lamellaCount: 1,
      targetPanelWidthMm: 600,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects zero panel width with the stable code", () => {
    const result = runGlueUpLamellaRule({
      lamellaCount: 4,
      targetPanelWidthMm: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_panel_width");
  });

  it("rejects negative panel width with the stable code", () => {
    const result = runGlueUpLamellaRule({
      lamellaCount: 4,
      targetPanelWidthMm: -100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_panel_width");
  });

  it("rejects fractional lamella counts", () => {
    expect(
      runGlueUpLamellaRule({
        lamellaCount: 2.5,
        targetPanelWidthMm: 600,
      }).ok,
    ).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runGlueUpLamellaRule({ lamellaCount: 4 }).ok).toBe(false);
  });
});
