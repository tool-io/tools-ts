import { describe, expect, it } from "vitest";
import { grayCodeEncodeExample, grayCodeEncodeTool } from "./tool.js";
import { runGrayCodeEncode } from "./tool.js";

const issueCodes = (input: unknown) => {
  const result = runGrayCodeEncode(input);
  return result.ok ? [] : result.error.issues.map((issue) => issue.code);
};

describe("Gray Code Encoder", () => {
  it("publishes an executable example with its exact verified output", () => {
    expect(runGrayCodeEncode(grayCodeEncodeExample.input)).toEqual({
      ok: true,
      output: grayCodeEncodeExample.output,
    });
  });

  it("declares the convert/gray-code-encode tool id", () => {
    expect(grayCodeEncodeTool.id).toBe("convert/gray-code-encode");
    expect(grayCodeEncodeTool.title).toBe("Gray Code Encoder");
  });

  it("encodes zero to zero", () => {
    expect(runGrayCodeEncode({ value: 0 })).toEqual({
      ok: true,
      output: { grayCode: 0 },
    });
  });

  it("encodes one to one", () => {
    expect(runGrayCodeEncode({ value: 1 })).toEqual({
      ok: true,
      output: { grayCode: 1 },
    });
  });

  it("encodes two and three to reflected neighbors", () => {
    expect(runGrayCodeEncode({ value: 2 })).toEqual({
      ok: true,
      output: { grayCode: 3 },
    });
    expect(runGrayCodeEncode({ value: 3 })).toEqual({
      ok: true,
      output: { grayCode: 2 },
    });
  });

  it("encodes the maximum boundary 2147483647", () => {
    expect(runGrayCodeEncode({ value: 2147483647 })).toEqual({
      ok: true,
      output: { grayCode: 1073741824 },
    });
  });

  it("encodes small known values", () => {
    expect(runGrayCodeEncode({ value: 4 })).toEqual({
      ok: true,
      output: { grayCode: 6 },
    });
    expect(runGrayCodeEncode({ value: 5 })).toEqual({
      ok: true,
      output: { grayCode: 7 },
    });
    expect(runGrayCodeEncode({ value: 255 })).toEqual({
      ok: true,
      output: { grayCode: 128 },
    });
  });

  it("changes exactly one bit between consecutive integers", () => {
    for (let value = 0; value < 32; value += 1) {
      const low = runGrayCodeEncode({ value });
      const high = runGrayCodeEncode({ value: value + 1 });
      if (!low.ok || !high.ok) throw new Error("unexpected failure");
      const diff = Number(low.output.grayCode) ^ Number(high.output.grayCode);
      expect(diff !== 0 && (diff & (diff - 1)) === 0).toBe(true);
    }
  });

  it("rejects negative values at schema validation", () => {
    expect(issueCodes({ value: -1 })).toEqual(["invalid_field"]);
  });

  it("rejects values above the schema maximum", () => {
    expect(issueCodes({ value: 2147483648 })).toEqual(["invalid_field"]);
  });

  it("rejects non-integers at schema validation", () => {
    expect(issueCodes({ value: 1.5 })).toEqual(["invalid_field"]);
  });
});
