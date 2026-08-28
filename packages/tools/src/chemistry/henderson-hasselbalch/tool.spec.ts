import { describe, expect, it } from "vitest";
import {
  runHendersonHasselbalch,
  hendersonHasselbalchExample,
} from "./tool.js";
describe("Henderson-Hasselbalch pH", () => {
  it("publishes an executable example", () =>
    expect(runHendersonHasselbalch(hendersonHasselbalchExample.input)).toEqual({
      ok: true,
      output: hendersonHasselbalchExample.output,
    }));
  it("returns pKa for equimolar base and acid", () =>
    expect(
      runHendersonHasselbalch({ acidM: 0.1, conjugateBaseM: 0.1, pKa: 4.76 }),
    ).toEqual({
      ok: true,
      output: { ph: 4.76 },
    }));
  it("rises above pKa when base dominates", () => {
    const result = runHendersonHasselbalch({
      acidM: 0.1,
      conjugateBaseM: 1,
      pKa: 4.76,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ph).toBeCloseTo(5.76, 12);
  });
  it("falls below pKa when acid dominates", () => {
    const result = runHendersonHasselbalch({
      acidM: 1,
      conjugateBaseM: 0.1,
      pKa: 7.2,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ph).toBeCloseTo(6.2, 12);
  });
  it("rejects zero acid concentration", () =>
    expect(
      runHendersonHasselbalch({ acidM: 0, conjugateBaseM: 0.1, pKa: 4.76 }).ok,
    ).toBe(false));
  it("rejects negative conjugate base concentration", () =>
    expect(
      runHendersonHasselbalch({ acidM: 0.1, conjugateBaseM: -0.1, pKa: 4.76 })
        .ok,
    ).toBe(false));
  it("rejects non-numeric pKa", () =>
    expect(
      runHendersonHasselbalch({
        acidM: 0.1,
        conjugateBaseM: 0.1,
        pKa: Number.NaN,
      }).ok,
    ).toBe(false));
});
