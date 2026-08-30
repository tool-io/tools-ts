import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDcpFileSize, example } from "./tool.js";

describe("film/dcp-file-size", () => {
  it("matches its worked example", () => {
    expect(calculateDcpFileSize(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("converts a one-hour 250 Mb/s stream to decimal gigabytes", () => {
    expect(
      tool.execute({
        totalBitrateMegabitsPerSecond: 250,
        runtimeSeconds: 3600,
      }),
    ).toEqual({ ok: true, output: { fileGigabytes: 112.5 } });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({
        ...example.input,
        totalBitrateMegabitsPerSecond: Number.NaN,
      }).ok,
    ).toBe(false);
  });
});
