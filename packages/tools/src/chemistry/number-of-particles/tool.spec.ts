import { describe, expect, it } from "vitest";
import {
  AVOGADRO,
  numberOfParticlesExample,
  runNumberOfParticles,
} from "./tool.js";

describe("Particle Count Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runNumberOfParticles(numberOfParticlesExample.input)).toEqual({
      ok: true,
      output: numberOfParticlesExample.output,
    });
  });

  it("maps one mole onto Avogadro's number", () => {
    expect(runNumberOfParticles({ moles: 1 })).toEqual({
      ok: true,
      output: { particleCount: AVOGADRO },
    });
  });

  it("maps half a mole onto half of Avogadro's number", () => {
    expect(runNumberOfParticles({ moles: 0.5 })).toEqual({
      ok: true,
      output: { particleCount: 0.5 * AVOGADRO },
    });
  });

  it("uses Avogadro's constant 6.02214076e23", () => {
    expect(AVOGADRO).toBe(6.02214076e23);
  });

  it("returns zero particles for zero moles", () =>
    expect(runNumberOfParticles({ moles: 0 })).toEqual({
      ok: true,
      output: { particleCount: 0 },
    }));

  it("rejects negative moles", () => {
    expect(runNumberOfParticles({ moles: -1 }).ok).toBe(false);
  });

  it("requires the mole amount", () => {
    expect(runNumberOfParticles({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runNumberOfParticles(null).ok).toBe(false);
  });
});
