import { describe, expect, it } from "vitest";
import {
  leafPhosphorusContentExample,
  runLeafPhosphorusContent,
} from "./tool.js";

describe("Leaf Phosphorus Content", () => {
  it("publishes an executable example", () =>
    expect(
      runLeafPhosphorusContent(leafPhosphorusContentExample.input),
    ).toEqual({
      ok: true,
      output: leafPhosphorusContentExample.output,
    }));
  it("doubles when phosphorus mass doubles at fixed leaf mass", () =>
    expect(
      runLeafPhosphorusContent({ leafDryMassG: 2, phosphorusMassMg: 6 }),
    ).toEqual({ ok: true, output: { leafPhosphorusMgPerG: 3 } }));
  it("rises as the leaf dry mass shrinks", () =>
    expect(
      runLeafPhosphorusContent({ leafDryMassG: 1, phosphorusMassMg: 3 }),
    ).toEqual({ ok: true, output: { leafPhosphorusMgPerG: 3 } }));
  it("keeps fractional concentrations exact", () =>
    expect(
      runLeafPhosphorusContent({ leafDryMassG: 8, phosphorusMassMg: 10 }),
    ).toEqual({ ok: true, output: { leafPhosphorusMgPerG: 1.25 } }));
  it("rejects zero phosphorus mass", () => {
    const result = runLeafPhosphorusContent({
      leafDryMassG: 2,
      phosphorusMassMg: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("phosphorusMassMg");
  });
  it("rejects zero leaf dry mass", () => {
    const result = runLeafPhosphorusContent({
      leafDryMassG: 0,
      phosphorusMassMg: 3,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("leafDryMassG");
  });
  it("rejects negative masses", () => {
    const result = runLeafPhosphorusContent({
      leafDryMassG: 2,
      phosphorusMassMg: -3,
    });
    expect(result.ok).toBe(false);
  });
});
