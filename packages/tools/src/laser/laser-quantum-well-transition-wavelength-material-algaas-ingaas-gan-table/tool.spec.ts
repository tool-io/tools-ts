import { describe, expect, it } from "vitest";
import {
  quantumWellWavelengthExample as example,
  runQuantumWellWavelength,
} from "./tool.js";
describe("III-V bulk band-edge proxy", () => {
  it("reproduces its AlGaAs composition example", () =>
    expect(runQuantumWellWavelength(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects indirect-gap AlGaAs compositions", () =>
    expect(
      runQuantumWellWavelength({ fraction: 0.5, system: "algaas" }).ok,
    ).toBe(false));
});
