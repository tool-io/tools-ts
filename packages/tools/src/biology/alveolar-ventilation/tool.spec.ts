import { describe, expect, it } from "vitest";
import { alveolarVentilationExample, runAlveolarVentilation } from "./tool.js";

describe("Alveolar Ventilation L/min", () => {
  it("publishes an executable example", () =>
    expect(runAlveolarVentilation(alveolarVentilationExample.input)).toEqual({
      ok: true,
      output: alveolarVentilationExample.output,
    }));
  it("multiplies alveolar volume per breath by respiratory rate", () =>
    expect(
      runAlveolarVentilation({
        deadSpaceMl: 200,
        respiratoryRatePerMin: 15,
        tidalVolumeMl: 600,
      }),
    ).toEqual({ ok: true, output: { alveolarVentilationLPerMin: 6 } }));
  it("yields zero when dead space equals tidal volume", () =>
    expect(
      runAlveolarVentilation({
        deadSpaceMl: 500,
        respiratoryRatePerMin: 12,
        tidalVolumeMl: 500,
      }),
    ).toEqual({ ok: true, output: { alveolarVentilationLPerMin: 0 } }));
  it("handles fractional results", () =>
    expect(
      runAlveolarVentilation({
        deadSpaceMl: 125,
        respiratoryRatePerMin: 14,
        tidalVolumeMl: 475,
      }),
    ).toEqual({ ok: true, output: { alveolarVentilationLPerMin: 4.9 } }));
  it("rejects dead space above tidal volume with negative_ventilation", () => {
    const result = runAlveolarVentilation({
      deadSpaceMl: 600,
      respiratoryRatePerMin: 12,
      tidalVolumeMl: 500,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("negative_ventilation");
  });
  it("rejects zero respiratory rate", () =>
    expect(
      runAlveolarVentilation({
        deadSpaceMl: 150,
        respiratoryRatePerMin: 0,
        tidalVolumeMl: 500,
      }).ok,
    ).toBe(false));
  it("rejects negative volumes", () =>
    expect(
      runAlveolarVentilation({
        deadSpaceMl: -150,
        respiratoryRatePerMin: 12,
        tidalVolumeMl: 500,
      }).ok,
    ).toBe(false));
  it("rejects missing inputs", () =>
    expect(runAlveolarVentilation({ respiratoryRatePerMin: 12 }).ok).toBe(
      false,
    ));
});
