import { describe, expect, it } from "vitest";
import {
  base122DecoderExample,
  decodeBase122,
  runBase122Decoder,
} from "./tool.js";

describe("Base122 Decoder", () => {
  it("decodes reference artifacts", () => {
    expect(decodeBase122("")).toBe("");
    expect(decodeBase122("$\u0019-Fc<")).toBe("Hello");
    expect(decodeBase122("*\u001bmva9Ro")).toBe("Tool.io");
    expect(decodeBase122("6\u001a-f)D\u0014l4[LS\u00104\u0014")).toBe(
      "line1\nline2\r\n",
    );
  });
  it("rejects non-canonical and non-UTF-8 artifacts", () => {
    expect(runBase122Decoder({ base122: "A" }).ok).toBe(false);
    expect(runBase122Decoder({ base122: "\u007f" }).ok).toBe(false);
  });
  it("publishes an executable example", () =>
    expect(runBase122Decoder(base122DecoderExample.input)).toEqual({
      ok: true,
      output: base122DecoderExample.output,
    }));
});
