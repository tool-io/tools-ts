import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateVideoBlankingInterval, example } from "./tool.js";

describe("electronics/video-blanking-interval", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateVideoBlankingInterval(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, horizontalTotalPixels: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain boundary", () => {
    expect(
      tool.execute({ ...example.input, horizontalTotalPixels: 0 }).ok,
    ).toBe(false);
  });
  it("handles a zero boundary", () => {
    expect(
      tool.execute({ ...example.input, horizontalActivePixels: 0 }),
    ).toEqual({
      ok: true,
      output: { horizontalBlankingPixels: 2200, verticalBlankingLines: 45 },
    });
  });
});
