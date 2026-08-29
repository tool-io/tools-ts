import { describe, expect, it } from "vitest";
import {
  runSternVolmerQuenching,
  sternVolmerQuenchingExample,
} from "./tool.js";
describe("Stern-Volmer Ratio", () => {
  it("publishes an executable example", () =>
    expect(runSternVolmerQuenching(sternVolmerQuenchingExample.input)).toEqual({
      ok: true,
      output: sternVolmerQuenchingExample.output,
    }));
  it("returns unity without quencher", () =>
    expect(runSternVolmerQuenching({ ksv: 200, quencherM: 0 })).toEqual({
      ok: true,
      output: { sternVolmerRatio: 1 },
    }));
  it("matches a strong quenching case", () =>
    expect(runSternVolmerQuenching({ ksv: 100, quencherM: 0.02 })).toEqual({
      ok: true,
      output: { sternVolmerRatio: 3 },
    }));
  it("grows linearly with quencher concentration", () => {
    const result = runSternVolmerQuenching({
      ksv: 350.5,
      quencherM: 0.004,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.sternVolmerRatio).toBeCloseTo(2.402, 12);
  });
  it("doubles with doubled Ksv at fixed quencher", () =>
    expect(runSternVolmerQuenching({ ksv: 400, quencherM: 0.002 })).toEqual({
      ok: true,
      output: { sternVolmerRatio: 1.8 },
    }));
  it("returns unity for a zero quenching constant", () =>
    expect(runSternVolmerQuenching({ ksv: 0, quencherM: 0.002 })).toEqual({
      ok: true,
      output: { sternVolmerRatio: 1 },
    }));
  it("rejects negative Ksv", () =>
    expect(runSternVolmerQuenching({ ksv: -200, quencherM: 0.002 }).ok).toBe(
      false,
    ));
  it("rejects negative quencher concentration", () =>
    expect(runSternVolmerQuenching({ ksv: 200, quencherM: -0.001 }).ok).toBe(
      false,
    ));
});
