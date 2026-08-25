import { describe, expect, it } from "vitest";
import {
  runTasteCodedEntryChecker,
  tasteCodedEntryCheckerExample,
  tasteCodedEntryCheckerTool,
} from "./tool.js";

describe("tasteCodedEntryCheckerTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTasteCodedEntryChecker(tasteCodedEntryCheckerExample.input),
    ).toEqual({
      ok: true,
      output: tasteCodedEntryCheckerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(tasteCodedEntryCheckerExample))).toEqual(
      tasteCodedEntryCheckerExample,
    );
    expect(tasteCodedEntryCheckerTool.contractVersion).toBe(1);
    expect(tasteCodedEntryCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("records mild", () => {
    const r = runTasteCodedEntryChecker({ taste: "mild" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.taste).toBe("mild");
  });

  it("keeps acrid and peppery distinct", () => {
    const acrid = runTasteCodedEntryChecker({ taste: "acrid" });
    const peppery = runTasteCodedEntryChecker({ taste: "peppery" });
    if (!acrid.ok || !peppery.ok) throw new Error("expected success");
    expect(acrid.output.taste).toBe("acrid");
    expect(peppery.output.taste).toBe("peppery");
  });

  it("records bitter", () => {
    const r = runTasteCodedEntryChecker({ taste: "bitter" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.taste).toBe("bitter");
  });

  it("records farinaceous", () => {
    const r = runTasteCodedEntryChecker({ taste: "farinaceous" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.taste).toBe("farinaceous");
  });

  it("rejects unknown tastes", () => {
    expect(runTasteCodedEntryChecker({ taste: "sweet" }).ok).toBe(false);
    expect(runTasteCodedEntryChecker({ taste: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runTasteCodedEntryChecker(null).ok).toBe(false);
    expect(runTasteCodedEntryChecker({ taste: null }).ok).toBe(false);
    expect(
      runTasteCodedEntryChecker({
        ...tasteCodedEntryCheckerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
