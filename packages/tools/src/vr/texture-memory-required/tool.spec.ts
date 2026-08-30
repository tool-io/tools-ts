import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateTextureMemoryRequired, example } from "./tool.js";

describe("vr/texture-memory-required", () => {
  it("matches its worked example", () => {
    expect(calculateTextureMemoryRequired(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("allocates 4 MiB for one uncompressed 1024-square RGBA8 texture", () => {
    expect(
      tool.execute({
        widthPixels: 1024,
        heightPixels: 1024,
        channels: 4,
        bytesPerChannel: 1,
        textureCount: 1,
      }),
    ).toEqual({ ok: true, output: { mebibytes: 4 } });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, widthPixels: Number.NaN }).ok).toBe(
      false,
    );
  });
});
