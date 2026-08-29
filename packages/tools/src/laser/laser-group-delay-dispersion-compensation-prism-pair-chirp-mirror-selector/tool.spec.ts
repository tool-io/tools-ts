import { describe, expect, it } from "vitest";
import {
  gddSelector,
  gddSelectorExample as example,
  runGddSelector,
} from "./tool.js";

describe("GDD compensation selector", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runGddSelector(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("escalates method with compensation magnitude", () => {
    const capacities = {
      chirpedMirrorCapacityFs2: 1000,
      prismPairCapacityFs2: 20000,
    };
    expect(gddSelector({ ...capacities, neededGddFs2: -500 }).method).toBe(
      "chirped-mirrors",
    );
    expect(gddSelector({ ...capacities, neededGddFs2: -10000 }).method).toBe(
      "prism-pair",
    );
    expect(gddSelector({ ...capacities, neededGddFs2: -100000 }).method).toBe(
      "grating-pair",
    );
    expect(gddSelector({ ...capacities, neededGddFs2: 10000 }).method).toBe(
      "prism-pair",
    );
  });
  it("rejects non-finite GDD", () =>
    expect(
      runGddSelector({
        neededGddFs2: Number.NaN,
        chirpedMirrorCapacityFs2: 1000,
        prismPairCapacityFs2: 20000,
      }).ok,
    ).toBe(false));
});
