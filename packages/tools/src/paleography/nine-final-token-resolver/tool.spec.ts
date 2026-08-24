import { describe, expect, it } from "vitest";
import {
  nineFinalTokenResolverExample,
  runNineFinalTokenResolver,
} from "./tool.js";

describe("nine-final-token-resolver", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNineFinalTokenResolver(nineFinalTokenResolverExample.input),
    ).toEqual({ ok: true, output: nineFinalTokenResolverExample.output });
  });

  it("resolves the is reading when chosen", () => {
    const result = runNineFinalTokenResolver({
      stemLetters: "seru",
      finalSense: "is",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.resolvedToken as string).toBe("seruis");
    expect(result.output.appliedFinal as string).toBe("is");
  });

  it("rejects empty or non-alphabetic stems", () => {
    expect(runNineFinalTokenResolver({ stemLetters: "" }).ok).toBe(false);
    expect(runNineFinalTokenResolver({ stemLetters: "s3rv" }).ok).toBe(false);
  });
});
