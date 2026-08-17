import { describe, expect, it } from "vitest";
import { runBase58Decoder } from "../../decode/base58/tool.js";
import {
  calculateBase58Encode,
  base58EncoderExample,
  runBase58Encoder,
} from "./tool.js";

describe("base58 encoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBase58Encoder(base58EncoderExample.input)).toEqual({
      ok: true,
      output: base58EncoderExample.output,
    });
  });

  it("round-trips through the decoder", async () => {
    const { runBase58Decoder } = await import("../../decode/base58/tool.js");
    for (const text of ["a", "Hello World!", "any carnal pleasure", "éλ"]) {
      const encoded = calculateBase58Encode({ text }).encoded;
      expect(runBase58Decoder({ base58: encoded })).toEqual({
        ok: true,
        output: { text },
      });
    }
  });

  it("rejects empty input and alphabet errors on decode", () => {
    const decoded = runBase58Decoder({ base58: "0OIl" });
    expect(decoded).toMatchObject({
      error: { issues: [{ code: "alphabet_invalid" }] },
      ok: false,
    });
  });
});
