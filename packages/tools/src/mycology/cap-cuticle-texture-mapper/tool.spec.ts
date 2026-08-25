import { describe, expect, it } from "vitest";
import {
  capCuticleTextureMapperExample,
  capCuticleTextureMapperTool,
  runCapCuticleTextureMapper,
} from "./tool.js";

describe("capCuticleTextureMapperTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCapCuticleTextureMapper(capCuticleTextureMapperExample.input),
    ).toEqual({
      ok: true,
      output: capCuticleTextureMapperExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(capCuticleTextureMapperExample))).toEqual(
      capCuticleTextureMapperExample,
    );
    expect(capCuticleTextureMapperTool.contractVersion).toBe(1);
    expect(capCuticleTextureMapperTool.execution).toEqual({ kind: "pure" });
  });

  it("passes through the smooth and viscid textures", () => {
    const smooth = runCapCuticleTextureMapper({ texture: "smooth" });
    const viscid = runCapCuticleTextureMapper({ texture: "viscid" });
    if (!smooth.ok || !viscid.ok) throw new Error("expected success");
    expect(smooth.output.cuticleTextureClass).toBe("smooth");
    expect(viscid.output.cuticleTextureClass).toBe("viscid");
  });

  it("passes through the glutinous and tomentose textures", () => {
    const glutinous = runCapCuticleTextureMapper({ texture: "glutinous" });
    const tomentose = runCapCuticleTextureMapper({ texture: "tomentose" });
    if (!glutinous.ok || !tomentose.ok) throw new Error("expected success");
    expect(glutinous.output.cuticleTextureClass).toBe("glutinous");
    expect(tomentose.output.cuticleTextureClass).toBe("tomentose");
  });

  it("passes through the squamulose and rimose textures", () => {
    const squamulose = runCapCuticleTextureMapper({ texture: "squamulose" });
    const rimose = runCapCuticleTextureMapper({ texture: "rimose" });
    if (!squamulose.ok || !rimose.ok) throw new Error("expected success");
    expect(squamulose.output.cuticleTextureClass).toBe("squamulose");
    expect(rimose.output.cuticleTextureClass).toBe("rimose");
  });

  it("passes through the areolate texture", () => {
    const r = runCapCuticleTextureMapper({ texture: "areolate" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.cuticleTextureClass).toBe("areolate");
  });

  it("rejects unknown textures", () => {
    expect(runCapCuticleTextureMapper({ texture: "pruinose" }).ok).toBe(false);
    expect(runCapCuticleTextureMapper({ texture: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runCapCuticleTextureMapper(null).ok).toBe(false);
    expect(runCapCuticleTextureMapper({ texture: 7 }).ok).toBe(false);
    expect(
      runCapCuticleTextureMapper({
        ...capCuticleTextureMapperExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
