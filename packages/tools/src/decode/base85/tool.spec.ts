import { describe, expect, it } from "vitest";
import {
  base85DecoderExample,
  runBase85Decoder,
} from "./tool.js";
import { calculateBase85Encode } from "../../encode/base85/tool.js";

describe("base85 decoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBase85Decoder(base85DecoderExample.input)).toEqual({
      ok: true,
      output: base85DecoderExample.output,
    });
  });

  it("rejects impossible group lengths", () => {
    expect(runBase85Decoder({ base85: "a" })).toMatchObject({
      error: { issues: [{ code: "length_invalid" }] },
      ok: false,
    });
  });
});
