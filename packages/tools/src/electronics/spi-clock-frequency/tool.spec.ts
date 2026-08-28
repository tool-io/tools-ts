import { describe, expect, it } from "vitest";
import { runSpiClockFrequency } from "./tool.js";
describe("SPI Clock Divider", () => {
  it("divides by 128", () =>
    expect(
      runSpiClockFrequency({ cpuClockHz: 16000000, divider: 128 }),
    ).toEqual({
      ok: true,
      output: { spiClockHz: 125000 },
    }));
  it("passes through on divider one", () =>
    expect(runSpiClockFrequency({ cpuClockHz: 8000000, divider: 1 })).toEqual({
      ok: true,
      output: { spiClockHz: 8000000 },
    }));
  it("divides by the maximum divider", () =>
    expect(
      runSpiClockFrequency({ cpuClockHz: 16000000, divider: 256 }),
    ).toEqual({
      ok: true,
      output: { spiClockHz: 62500 },
    }));
  it("rejects dividers that are not powers of two", () => {
    const result = runSpiClockFrequency({ cpuClockHz: 16000000, divider: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_divider");
  });
  it("rejects out-of-range dividers", () =>
    expect(
      runSpiClockFrequency({ cpuClockHz: 16000000, divider: 512 }).ok,
    ).toBe(false));
  it("rejects non-integer dividers", () =>
    expect(
      runSpiClockFrequency({ cpuClockHz: 16000000, divider: 2.5 }).ok,
    ).toBe(false));
  it("rejects a non-positive CPU clock", () =>
    expect(runSpiClockFrequency({ cpuClockHz: 0, divider: 2 }).ok).toBe(false));
});
