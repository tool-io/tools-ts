import { describe, expect, it } from "vitest";
import { runSerialDilution, serialDilutionExample } from "./tool.js";

describe("Serial Dilution Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSerialDilution(serialDilutionExample.input)).toEqual({
      ok: true,
      output: serialDilutionExample.output,
    });
  });

  it("halves to unity after three transfers from eight", () => {
    expect(
      runSerialDilution({
        initialConcentration: 8,
        dilutionFactor: 0.5,
        transferCount: 3,
      }),
    ).toEqual({
      ok: true,
      output: { finalConcentration: 1 },
    });
  });

  it("defaults the dilution factor to one tenth", () => {
    const result = runSerialDilution({
      initialConcentration: 8,
      transferCount: 3,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.finalConcentration).toBeCloseTo(0.008, 12);
  });

  it("handles a single quartering transfer", () => {
    expect(
      runSerialDilution({
        initialConcentration: 4,
        dilutionFactor: 0.25,
        transferCount: 1,
      }),
    ).toEqual({
      ok: true,
      output: { finalConcentration: 1 },
    });
  });

  it("rejects a factor of exactly one", () => {
    const result = runSerialDilution({
      initialConcentration: 1,
      dilutionFactor: 1,
      transferCount: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_factor");
  });

  it("rejects a zero factor", () => {
    const result = runSerialDilution({
      initialConcentration: 1,
      dilutionFactor: 0,
      transferCount: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_factor");
  });

  it("rejects a non-positive transfer count", () => {
    expect(
      runSerialDilution({
        initialConcentration: 1,
        transferCount: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects a non-positive initial concentration", () => {
    expect(
      runSerialDilution({ initialConcentration: -1, transferCount: 1 }).ok,
    ).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runSerialDilution(1).ok).toBe(false);
  });
});
