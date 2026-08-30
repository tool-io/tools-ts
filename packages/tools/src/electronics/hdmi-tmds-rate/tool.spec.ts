import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateHdmiTmdsRate, example } from "./tool.js";

describe("electronics/hdmi-tmds-rate", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateHdmiTmdsRate(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, pixelClockMHz: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain boundary", () => {
    expect(tool.execute({ ...example.input, bitsPerChannel: 90 }).ok).toBe(
      false,
    );
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, pixelClockMHz: 0 })).toEqual({
      ok: true,
      output: { laneRateGbps: 0 },
    });
  });
});
