import { describe, expect, it } from "vitest";
import { blockFuelExample, runBlockFuel } from "./tool.js";

describe("block fuel calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBlockFuel(blockFuelExample.input)).toEqual({
      ok: true,
      output: blockFuelExample.output,
    });
  });

  it("sums all-zero inputs to zero", () => {
    expect(
      runBlockFuel({
        alternateFuelKg: 0,
        contingencyFuelKg: 0,
        finalReserveFuelKg: 0,
        taxiFuelKg: 0,
        tripFuelKg: 0,
      }),
    ).toEqual({ ok: true, output: { blockFuelKg: 0 } });
  });

  it("reduces to the only nonzero component", () => {
    expect(
      runBlockFuel({
        alternateFuelKg: 0,
        contingencyFuelKg: 0,
        finalReserveFuelKg: 0,
        taxiFuelKg: 200,
        tripFuelKg: 0,
      }),
    ).toEqual({ ok: true, output: { blockFuelKg: 200 } });
  });

  it("rejects negative trip fuel", () => {
    expect(
      runBlockFuel({
        alternateFuelKg: 0,
        contingencyFuelKg: 0,
        finalReserveFuelKg: 0,
        taxiFuelKg: 0,
        tripFuelKg: -1,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative contingency fuel", () => {
    expect(
      runBlockFuel({
        alternateFuelKg: 0,
        contingencyFuelKg: -10,
        finalReserveFuelKg: 0,
        taxiFuelKg: 0,
        tripFuelKg: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative alternate fuel", () => {
    expect(
      runBlockFuel({
        alternateFuelKg: -5,
        contingencyFuelKg: 0,
        finalReserveFuelKg: 0,
        taxiFuelKg: 0,
        tripFuelKg: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative final reserve fuel", () => {
    expect(
      runBlockFuel({
        alternateFuelKg: 0,
        contingencyFuelKg: 0,
        finalReserveFuelKg: -2,
        taxiFuelKg: 0,
        tripFuelKg: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative taxi fuel", () => {
    expect(
      runBlockFuel({
        alternateFuelKg: 0,
        contingencyFuelKg: 0,
        finalReserveFuelKg: 0,
        taxiFuelKg: -3,
        tripFuelKg: 0,
      }).ok,
    ).toBe(false);
  });

  it("computes a realistic narrowbody block total", () => {
    expect(
      runBlockFuel({
        alternateFuelKg: 1200,
        contingencyFuelKg: 425,
        finalReserveFuelKg: 1050,
        taxiFuelKg: 250,
        tripFuelKg: 8500,
      }),
    ).toEqual({ ok: true, output: { blockFuelKg: 11425 } });
  });

  it("requires every component", () => {
    expect(
      runBlockFuel({
        alternateFuelKg: 0,
        contingencyFuelKg: 0,
        finalReserveFuelKg: 0,
        tripFuelKg: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown input fields", () => {
    expect(
      runBlockFuel({
        alternateFuelKg: 0,
        contingencyFuelKg: 0,
        extraField: 1,
        finalReserveFuelKg: 0,
        taxiFuelKg: 0,
        tripFuelKg: 0,
      } as Record<string, number>).ok,
    ).toBe(false);
  });
});
