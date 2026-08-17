import { describe, expect, it } from "vitest";
import {
  base85EncoderExample,
  calculateBase85Encode,
  runBase85Encoder,
} from "./tool.js";
import { runBase85Decoder } from "../../decode/base85/tool.js";

describe("base85 encoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBase85Encoder(base85EncoderExample.input)).toEqual({
      ok: true,
      output: base85EncoderExample.output,
    });
  });

  it("emits the documented partial-group lengths", () => {
    expect(calculateBase85Encode({ text: "a" }).encoded).toBe("@/");
    expect(calculateBase85Encode({ text: "ab" }).encoded).toBe("@:B");
    expect(calculateBase85Encode({ text: "abc" }).encoded).toBe("@:E^");
    expect(calculateBase85Encode({ text: "abcd" }).encoded).toBe("@:E_W");
  });

  it("compresses full zero groups to z", () => {
    const nulls = "\u0000\u0000\u0000\u0000";
    expect(calculateBase85Encode({ text: nulls }).encoded).toBe("z");
    expect(runBase85Decoder({ base85: "z" })).toEqual({
      ok: true,
      output: { text: nulls },
    });
  });

  it("round-trips through the decoder", () => {
    for (const text of [
      "",
      "a",
      "abcd",
      "Hello, world!",
      "any carnal pleasure",
      "éλ-utf8",
      "\u0000tail\u0000",
    ]) {
      const encoded = calculateBase85Encode({ text }).encoded;
      expect(runBase85Decoder({ base85: encoded })).toEqual({
        ok: true,
        output: { text },
      });
    }
  });

  it("rejects misplaced z through execution", () => {
    expect(runBase85Encoder({ text: "ok" }).ok).toBe(true);
    expect(runBase85Decoder({ base85: "az!" })).toMatchObject({
      error: { issues: [{ code: "z_misplaced" }] },
      ok: false,
    });
    expect(runBase85Decoder({ base85: "~evul" })).toMatchObject({
      error: { issues: [{ code: "alphabet_invalid" }] },
      ok: false,
    });
  });
});
