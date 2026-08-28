import { describe, expect, it } from "vitest";
import { paOutputPowerDbmExample, runPaOutputPowerDbm } from "./tool.js";

const outputOf = (input: {
  gainDb: number;
  inDbm: number;
  lossesDb: number;
}) => {
  const result = runPaOutputPowerDbm(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { paOutputDbm: number };
};

describe("PA Output dBm", () => {
  it("reproduces the canonical example", () =>
    expect(runPaOutputPowerDbm(paOutputPowerDbmExample.input)).toEqual({
      ok: true,
      output: { paOutputDbm: 32 },
    }));

  it("adds gain and subtracts losses from the input level", () => {
    const { paOutputDbm } = outputOf({
      gainDb: 14.5,
      inDbm: -3.25,
      lossesDb: 1.75,
    });
    expect(paOutputDbm).toBeCloseTo(-3.25 + 14.5 - 1.75, 12);
  });

  it("treats zero gain and zero losses as pass-through", () =>
    expect(outputOf({ gainDb: 0, inDbm: 17, lossesDb: 0 }).paOutputDbm).toBe(
      17,
    ));

  it("scales linearly with input power in decibels", () => {
    const base = outputOf({ gainDb: 20, inDbm: 0, lossesDb: 0 }).paOutputDbm;
    const raised = outputOf({ gainDb: 20, inDbm: 6, lossesDb: 0 }).paOutputDbm;
    expect(raised - base).toBeCloseTo(6, 12);
  });

  it("allows negative loss entries as extra gain", () =>
    expect(outputOf({ gainDb: 10, inDbm: 0, lossesDb: -2 }).paOutputDbm).toBe(
      12,
    ));

  it("can produce negative output levels for weak inputs", () =>
    expect(outputOf({ gainDb: 10, inDbm: -30, lossesDb: 5 }).paOutputDbm).toBe(
      -25,
    ));

  it("rejects non-finite inputs", () =>
    expect(
      runPaOutputPowerDbm({
        gainDb: Number.NaN,
        inDbm: 10,
        lossesDb: 0,
      } as unknown as { gainDb: number; inDbm: number; lossesDb: number }).ok,
    ).toBe(false));

  it("rejects unknown fields", () =>
    expect(
      runPaOutputPowerDbm({
        gainDb: 10,
        inDbm: 0,
        lossesDb: 0,
        extra: 1,
      } as unknown as { gainDb: number; inDbm: number; lossesDb: number }).ok,
    ).toBe(false));
});
