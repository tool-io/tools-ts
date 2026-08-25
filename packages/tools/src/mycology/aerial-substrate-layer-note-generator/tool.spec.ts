import { describe, expect, it } from "vitest";
import {
  aerialSubstrateLayerNoteGeneratorExample,
  runAerialSubstrateLayerNoteGenerator,
} from "./tool.js";

describe("Layer Note Generator", () => {
  it("matches the canonical example", () => {
    expect(
      runAerialSubstrateLayerNoteGenerator(
        aerialSubstrateLayerNoteGeneratorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: aerialSubstrateLayerNoteGeneratorExample.output,
    });
  });
  it("describes the substrate interface", () =>
    expect(
      runAerialSubstrateLayerNoteGenerator({ layer: "substrate-interface" }),
    ).toEqual({
      ok: true,
      output: {
        layerNote: "Mycelium observed at the substrate-air interface.",
      },
    }));
  it("describes buried mycelium", () =>
    expect(
      runAerialSubstrateLayerNoteGenerator({ layer: "buried-mycelium" }),
    ).toEqual({
      ok: true,
      output: { layerNote: "Mycelium observed within the substrate." },
    }));
  it("rejects unknown layers", () =>
    expect(
      runAerialSubstrateLayerNoteGenerator({
        layer: "surface-crust",
      } as unknown as { layer: "aerial-mycelium" }).ok,
    ).toBe(false));
  it("requires the layer field", () =>
    expect(
      runAerialSubstrateLayerNoteGenerator(
        {} as unknown as { layer: "aerial-mycelium" },
      ).ok,
    ).toBe(false));
});
