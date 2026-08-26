import { describe, expect, it } from "vitest";
import {
  leafPotassiumContentExample,
  runLeafPotassiumContent,
} from "./tool.js";

describe("Leaf Potassium Content", () => {
  it("publishes an executable example", () =>
    expect(runLeafPotassiumContent(leafPotassiumContentExample.input)).toEqual({
      ok: true,
      output: leafPotassiumContentExample.output,
    }));
  it("doubles when potassium mass doubles at fixed leaf mass", () =>
    expect(
      runLeafPotassiumContent({ leafDryMassG: 2, potassiumMassMg: 30 }),
    ).toEqual({ ok: true, output: { leafPotassiumMgPerG: 15 } }));
  it("rises as the leaf dry mass shrinks", () =>
    expect(
      runLeafPotassiumContent({ leafDryMassG: 1, potassiumMassMg: 15 }),
    ).toEqual({ ok: true, output: { leafPotassiumMgPerG: 15 } }));
  it("keeps fractional concentrations exact", () =>
    expect(
      runLeafPotassiumContent({ leafDryMassG: 8, potassiumMassMg: 10 }),
    ).toEqual({ ok: true, output: { leafPotassiumMgPerG: 1.25 } }));
  it("rejects zero potassium mass", () => {
    const result = runLeafPotassiumContent({
      leafDryMassG: 2,
      potassiumMassMg: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("potassiumMassMg");
  });
  it("rejects zero leaf dry mass", () => {
    const result = runLeafPotassiumContent({
      leafDryMassG: 0,
      potassiumMassMg: 15,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("leafDryMassG");
  });
  it("rejects negative masses", () => {
    const result = runLeafPotassiumContent({
      leafDryMassG: 2,
      potassiumMassMg: -15,
    });
    expect(result.ok).toBe(false);
  });
});
