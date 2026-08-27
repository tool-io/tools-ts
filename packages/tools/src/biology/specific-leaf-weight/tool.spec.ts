import { describe, expect, it } from "vitest";
import { specificLeafWeightExample, runSpecificLeafWeight } from "./tool.js";

describe("Specific Leaf Weight", () => {
  it("matches the canonical example", () => {
    expect(runSpecificLeafWeight(specificLeafWeightExample.input)).toEqual({
      ok: true,
      output: specificLeafWeightExample.output,
    });
  });

  it("inverts the inverse of leaf mass per area", () => {
    expect(
      runSpecificLeafWeight({ leafDryMassG: 2, leafAreaM2: 0.25 }),
    ).toEqual({ ok: true, output: { specificLeafWeight: 8 } });
  });

  it("accepts fractional masses", () => {
    expect(
      runSpecificLeafWeight({ leafDryMassG: 0.25, leafAreaM2: 0.5 }),
    ).toEqual({ ok: true, output: { specificLeafWeight: 0.5 } });
  });

  it("scales linearly with dry mass for a fixed area", () => {
    expect(
      runSpecificLeafWeight({ leafDryMassG: 120, leafAreaM2: 1.5 }),
    ).toEqual({ ok: true, output: { specificLeafWeight: 80 } });
  });

  it("rejects zero dry mass with a stable field", () => {
    const result = runSpecificLeafWeight({ leafDryMassG: 0, leafAreaM2: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "leafDryMassG",
      });
  });

  it("rejects zero area", () => {
    expect(runSpecificLeafWeight({ leafDryMassG: 10, leafAreaM2: 0 }).ok).toBe(
      false,
    );
  });

  it("rejects negative inputs through the schema and guard", () => {
    expect(runSpecificLeafWeight({ leafDryMassG: -5, leafAreaM2: 1 }).ok).toBe(
      false,
    );
    expect(runSpecificLeafWeight({ leafDryMassG: 5, leafAreaM2: -1 }).ok).toBe(
      false,
    );
  });
});
