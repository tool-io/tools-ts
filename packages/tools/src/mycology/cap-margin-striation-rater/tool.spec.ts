import { describe, expect, it } from "vitest";
import {
  capMarginStriationRaterExample,
  capMarginStriationRaterTool,
  runCapMarginStriationRater,
} from "./tool.js";

describe("capMarginStriationRaterTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCapMarginStriationRater(capMarginStriationRaterExample.input),
    ).toEqual({
      ok: true,
      output: capMarginStriationRaterExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(capMarginStriationRaterExample))).toEqual(
      capMarginStriationRaterExample,
    );
    expect(capMarginStriationRaterTool.contractVersion).toBe(1);
    expect(capMarginStriationRaterTool.execution).toEqual({ kind: "pure" });
  });

  it("reports no striations for a smooth margin", () => {
    const r = runCapMarginStriationRater({ striae: "none" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.striationsPresent).toBe(false);
    expect(r.output.marginType).toBe("none");
  });

  it("recognizes sulcate-striate margins", () => {
    const r = runCapMarginStriationRater({ striae: "sulcate-striate" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.striationsPresent).toBe(true);
    expect(r.output.marginType).toBe("sulcate-striate");
  });

  it("keeps distinct lineate and pectinate pattern descriptions", () => {
    const lineate = runCapMarginStriationRater({
      striae: "translucent-lineate",
    });
    const pectinate = runCapMarginStriationRater({ striae: "pectinate" });
    if (!lineate.ok || !pectinate.ok) throw new Error("expected success");
    expect(lineate.output.patternDescription).not.toBe(
      pectinate.output.patternDescription,
    );
  });

  it("rejects unknown striae codes", () => {
    expect(runCapMarginStriationRater({ striae: "grooved" }).ok).toBe(false);
    expect(runCapMarginStriationRater({ striae: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runCapMarginStriationRater(null).ok).toBe(false);
    expect(runCapMarginStriationRater({ striae: {} }).ok).toBe(false);
    expect(
      runCapMarginStriationRater({
        ...capMarginStriationRaterExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
