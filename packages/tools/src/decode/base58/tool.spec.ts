import { describe, expect, it } from "vitest";
import {
  base58DecoderExample,
  runBase58Decoder,
} from "./tool.js";
import { calculateBase58Encode } from "../../encode/base58/tool.js";

describe("base58 decoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBase58Decoder(base58DecoderExample.input)).toEqual({
      ok: true,
      output: base58DecoderExample.output,
    });
  });

  it("maps leading zero bytes to leading ones", () => {
    const text = "\u0000H";
    const encoded = calculateBase58Encode({ text }).encoded;
    expect(encoded.startsWith("1")).toBe(true);
    expect(encoded.endsWith("2F")).toBe(true);
    expect(runBase58Decoder({ base58: encoded })).toEqual({
      ok: true,
      output: { text },
    });
  });

  it("rejects non-alphabet characters", () => {
    expect(runBase58Decoder({ base58: "l1O0" })).toMatchObject({
      error: { issues: [{ code: "alphabet_invalid" }] },
      ok: false,
    });
  });
});
