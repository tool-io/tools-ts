import { describe, expect, it } from "vitest";
import {
  base91EncoderExample,
  encodeBase91,
  runBase91Encoder,
} from "./tool.js";

describe("Base91 Encoder", () => {
  it("matches reference encoder vectors", () => {
    expect(encodeBase91("")).toBe("");
    expect(encodeBase91("f")).toBe("LB");
    expect(encodeBase91("fo")).toBe("drD");
    expect(encodeBase91("Hello World!")).toBe(">OwJh>Io0Tv!8PE");
    expect(encodeBase91("Tool.io")).toBe("Lr.J7g${G");
  });
  it("returns a structured error for missing text", () =>
    expect(runBase91Encoder({}).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runBase91Encoder(base91EncoderExample.input)).toEqual({
      ok: true,
      output: base91EncoderExample.output,
    }));
});
