import { describe, expect, it } from "vitest";
import { equivalentAirspeedExample, runEquivalentAirspeed } from "./tool.js";

describe("equivalent airspeed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEquivalentAirspeed(equivalentAirspeedExample.input)).toEqual({
      ok: true,
      output: equivalentAirspeedExample.output,
    });
  });

  it("equals TAS at sea level density", () => {
    expect(runEquivalentAirspeed({ altitudeFt: 0, tasKt: 180 })).toEqual({
      ok: true,
      output: { easKt: 180 },
    });
  });

  it("rejects negative altitudes through execution", () => {
    expect(runEquivalentAirspeed({ altitudeFt: -10, tasKt: 100 }).ok).toBe(
      false,
    );
  });
});
