import { describe, expect, it } from "vitest";
import { runUartBaudRateError } from "./tool.js";
describe("UART Baud Error %", () => {
  it("calculates a typical register-derived error", () =>
    expect(
      runUartBaudRateError({ actualBaud: 9615, targetBaud: 9600 }),
    ).toEqual({
      ok: true,
      output: { baudErrorPercent: 0.15625 },
    }));
  it("returns zero for an exact match", () =>
    expect(
      runUartBaudRateError({ actualBaud: 115200, targetBaud: 115200 }),
    ).toEqual({
      ok: true,
      output: { baudErrorPercent: 0 },
    }));
  it("measures positive deviation", () =>
    expect(
      runUartBaudRateError({ actualBaud: 9648, targetBaud: 9600 }),
    ).toEqual({
      ok: true,
      output: { baudErrorPercent: 0.5 },
    }));
  it("measures negative deviation as absolute error", () =>
    expect(
      runUartBaudRateError({ actualBaud: 9552, targetBaud: 9600 }),
    ).toEqual({
      ok: true,
      output: { baudErrorPercent: 0.5 },
    }));
  it("rejects a zero target", () =>
    expect(runUartBaudRateError({ actualBaud: 9600, targetBaud: 0 }).ok).toBe(
      false,
    ));
  it("rejects a negative target", () =>
    expect(
      runUartBaudRateError({ actualBaud: 9600, targetBaud: -9600 }).ok,
    ).toBe(false));
  it("rejects a non-positive actual rate", () =>
    expect(runUartBaudRateError({ actualBaud: 0, targetBaud: 9600 }).ok).toBe(
      false,
    ));
});
