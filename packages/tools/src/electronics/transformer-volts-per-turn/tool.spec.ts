import { describe, expect, it } from "vitest";
import {
  calculateTransformerVoltsPerTurn,
  transformerVoltsPerTurnExample,
  runTransformerVoltsPerTurn,
} from "./tool.js";

describe("transformer volts per turn", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTransformerVoltsPerTurn(transformerVoltsPerTurnExample.input),
    ).toEqual({ ok: true, output: transformerVoltsPerTurnExample.output });
  });

  it("splits the primary voltage evenly across turns", () => {
    expect(
      calculateTransformerVoltsPerTurn({
        primaryTurnsInt: 24,
        primaryVolts: 120,
      }).voltsPerTurn,
    ).toBe(5);
  });

  it("inversely scales with the turn count", () => {
    const ten = calculateTransformerVoltsPerTurn({
      primaryTurnsInt: 10,
      primaryVolts: 240,
    }).voltsPerTurn;
    const twenty = calculateTransformerVoltsPerTurn({
      primaryTurnsInt: 20,
      primaryVolts: 240,
    }).voltsPerTurn;
    expect(twenty).toBe(ten / 2);
  });

  it("supports single-turn primaries", () => {
    expect(
      calculateTransformerVoltsPerTurn({
        primaryTurnsInt: 1,
        primaryVolts: 12.5,
      }).voltsPerTurn,
    ).toBe(12.5);
  });

  it("rejects non-positive voltages through execution", () => {
    expect(
      runTransformerVoltsPerTurn({ primaryTurnsInt: 100, primaryVolts: -230 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_voltage", field: "primaryVolts" }] },
      ok: false,
    });
  });

  it("rejects zero and non-integer turns through execution", () => {
    expect(
      runTransformerVoltsPerTurn({ primaryTurnsInt: 0, primaryVolts: 230 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_turns", field: "primaryTurnsInt" }] },
      ok: false,
    });
    expect(
      runTransformerVoltsPerTurn({
        primaryTurnsInt: 10.5,
        primaryVolts: 230,
      }).ok,
    ).toBe(false);
  });
});
