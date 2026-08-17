import { describe, expect, it } from "vitest";
import {
  base91DecoderExample,
  decodeBase91,
  runBase91Decoder,
} from "./tool.js";

describe("Base91 Decoder", () => {
  it("decodes reference vectors", () => {
    expect(decodeBase91("")).toBe("");
    expect(decodeBase91("LB")).toBe("f");
    expect(decodeBase91("drD")).toBe("fo");
    expect(decodeBase91(">OwJh>A")).toBe("Hello");
    expect(decodeBase91("dr/2s)uC")).toBe("foobar");
  });
  it("rejects characters outside the alphabet", () =>
    expect(runBase91Decoder({ base91: "AA AA" }).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runBase91Decoder(base91DecoderExample.input)).toEqual({
      ok: true,
      output: base91DecoderExample.output,
    }));
});
