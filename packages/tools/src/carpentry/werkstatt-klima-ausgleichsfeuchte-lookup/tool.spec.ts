import { describe, expect, it } from "vitest";
import {
  equilibriumMoistureLookupExample,
  equilibriumMoistureLookupTool,
  runEquilibriumMoistureLookup,
} from "./tool.js";

const run = (temperatureC: number, relativeHumidityPercent: number) =>
  runEquilibriumMoistureLookup({
    relativeHumidityPercent,
    temperatureC,
  });

describe("Equilibrium Moisture Lookup", () => {
  it("computes the canonical example", () =>
    expect(
      runEquilibriumMoistureLookup(equilibriumMoistureLookupExample.input),
    ).toEqual({
      ok: true,
      output: { equilibriumMoisturePercent: 9.5 },
    }));

  it.each([
    [10, 30, 7.5],
    [30, 90, 15],
    [10, 90, 18.5],
    [30, 30, 5.5],
  ])("returns the exact grid value at %p °C and %p % RH", (t, h, expected) =>
    expect(run(t, h)).toEqual({
      ok: true,
      output: { equilibriumMoisturePercent: expected },
    }),
  );

  it.each([
    [20, 70, 12.5],
    [20, 30, 6.5],
    [10, 70, 14.5],
    [30, 50, 8],
  ])("returns the exact grid value on the grid axes", (t, h, expected) =>
    expect(run(t, h)).toEqual({
      ok: true,
      output: { equilibriumMoisturePercent: expected },
    }),
  );

  it("interpolates between temperatures and humidities", () => {
    expect(run(15, 40)).toEqual({
      ok: true,
      output: { equilibriumMoisturePercent: 8.625 },
    });
    expect(run(25, 80)).toEqual({
      ok: true,
      output: { equilibriumMoisturePercent: 13.75 },
    });
  });

  it("interpolates a quarter step in temperature", () =>
    expect(run(12.5, 60)).toEqual({
      ok: true,
      output: { equilibriumMoisturePercent: 12.3125 },
    }));

  it("interpolates along the top humidity edge", () =>
    expect(run(15, 90)).toEqual({
      ok: true,
      output: { equilibriumMoisturePercent: 17.5 },
    }));

  it("rises with humidity at fixed temperature", () => {
    const dry = run(20, 40);
    const damp = run(20, 60);
    expect(dry.ok && damp.ok).toBe(true);
    if (dry.ok && damp.ok)
      expect(
        (damp.output as { equilibriumMoisturePercent: number })
          .equilibriumMoisturePercent,
      ).toBeGreaterThan(
        (dry.output as { equilibriumMoisturePercent: number })
          .equilibriumMoisturePercent,
      );
  });

  it("rejects temperatures outside 10 to 30 degrees", () => {
    const cold = run(9, 50);
    expect(cold.ok).toBe(false);
    if (!cold.ok)
      expect(cold.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "temperatureC",
        message: "Temperature is invalid.",
      });
    expect(run(35, 50).ok).toBe(false);
  });

  it("rejects humidity outside 30 to 90 percent", () => {
    const wet = run(20, 95);
    expect(wet.ok).toBe(false);
    if (!wet.ok)
      expect(wet.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "relativeHumidityPercent",
        message: "Relative humidity is invalid.",
      });
    expect(run(20, 10).ok).toBe(false);
  });

  it("rejects missing and non-finite inputs", () => {
    expect(runEquilibriumMoistureLookup({ temperatureC: 20 }).ok).toBe(false);
    expect(
      runEquilibriumMoistureLookup({ relativeHumidityPercent: 50 }).ok,
    ).toBe(false);
    expect(
      runEquilibriumMoistureLookup({
        relativeHumidityPercent: Number.NaN,
        temperatureC: Number.NaN,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric and unknown inputs", () => {
    expect(run("20" as never, 50).ok).toBe(false);
    const extra = runEquilibriumMoistureLookup({
      relativeHumidityPercent: 50,
      species: "spruce",
      temperatureC: 20,
    } as never);
    expect(extra.ok).toBe(false);
    if (!extra.ok) expect(extra.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(
      JSON.parse(JSON.stringify(equilibriumMoistureLookupExample)),
    ).toEqual(equilibriumMoistureLookupExample);
    expect(equilibriumMoistureLookupTool.id).toBe(
      "carpentry/werkstatt-klima-ausgleichsfeuchte-lookup",
    );
    expect(equilibriumMoistureLookupTool.execution).toEqual({
      kind: "pure",
    });
    expect(
      equilibriumMoistureLookupTool.inputSchema.properties?.temperatureC,
    ).toMatchObject({ minimum: 10, maximum: 30 });
    expect(
      equilibriumMoistureLookupTool.inputSchema.properties
        ?.relativeHumidityPercent,
    ).toMatchObject({ minimum: 30, maximum: 90 });
  });
});
