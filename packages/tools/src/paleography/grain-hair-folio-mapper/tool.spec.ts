import { describe, expect, it } from "vitest";
import {
  grainHairFolioMapperExample,
  runGrainHairFolioMapper,
} from "./tool.js";

describe("grain-hair-folio-mapper", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGrainHairFolioMapper(grainHairFolioMapperExample.input)).toEqual({
      ok: true,
      output: grainHairFolioMapperExample.output,
    });
  });

  it("gives uniform hair rectos in the default model", () => {
    const result = runGrainHairFolioMapper({ leavesPerQuire: 4 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.hairRectoLeafNumbers as number[]).toEqual([
      1, 2, 3, 4,
    ]);
    expect(result.output.fleshRectoLeafNumbers as number[]).toEqual([]);
  });

  it("rejects odd leaf counts", () => {
    expect(runGrainHairFolioMapper({ leavesPerQuire: 5 }).ok).toBe(false);
  });

  it("rejects a quire whose generated leaf list exceeds the output limit", () => {
    expect(runGrainHairFolioMapper({ leavesPerQuire: 100_002 }).ok).toBe(false);
  });
});
