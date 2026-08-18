import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import { byteSizeExample, byteSizeTool, calculateByteSize } from "./tool.js";

describe("Byte Size Formatter", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = byteSizeTool.execute(byteSizeExample.input);
    expect(result).toEqual({ ok: true, output: byteSizeExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(byteSizeTool.id).toBe("format/byte-size");
    expect(validateToolContract(byteSizeTool)).toEqual([]);
  });

  it("scales across units and standards", () => {
    expect(
      calculateByteSize({ bytes: 0 }),
    ).toMatchObject({ output: { formatted: "0 B", unit: "B" } });
    expect(
      calculateByteSize({ bytes: 999 }),
    ).toMatchObject({ output: { unit: "B" } });
    expect(
      calculateByteSize({ bytes: 5_000_000_000, precision: 2 }),
    ).toMatchObject({ output: { formatted: "5 GB", unit: "GB" } });
    const iec = calculateByteSize({
      bytes: 1536,
      precision: 2,
      standard: "iec",
    });
    expect(iec.ok).toBe(true);
    if (iec.ok) expect(iec.output.formatted).toBe("1.5 KiB");
  });

  it("rejects malformed probes", () => {
    expect(calculateByteSize(null).ok).toBe(false);
    expect(calculateByteSize({})).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(
      calculateByteSize({ bytes: -5 }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateByteSize({ bytes: 10, precision: 9 }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateByteSize({ bytes: 10, extra: 1 }),
    ).toMatchObject({ error: { code: "invalid_input" } });
  });
});
