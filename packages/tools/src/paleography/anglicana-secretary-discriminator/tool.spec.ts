import { describe, expect, it } from "vitest";
import {
  anglicanaSecretaryDiscriminatorExample,
  runAnglicanaSecretaryDiscriminator,
} from "./tool.js";

describe("anglicana-secretary-discriminator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAnglicanaSecretaryDiscriminator(
        anglicanaSecretaryDiscriminatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: anglicanaSecretaryDiscriminatorExample.output,
    });
  });

  it("declares an exact tie indeterminate", () => {
    const result = runAnglicanaSecretaryDiscriminator({
      anglicanaTraitCount: 2,
      secretaryTraitCount: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.verdict as string).toBe("indeterminate");
    expect(result.output.traitMargin as number).toBe(0);
  });

  it("rejects negative trait counts", () => {
    expect(
      runAnglicanaSecretaryDiscriminator({
        anglicanaTraitCount: -1,
        secretaryTraitCount: 2,
      }).ok,
    ).toBe(false);
  });
});
