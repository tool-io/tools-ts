import { describe, expect, it } from "vitest";
import {
  calculateRandomSignwritingHeadFaceSymbol,
  randomSignwritingHeadFaceSymbolExample,
  randomSignwritingHeadFaceSymbolValueCount,
  runRandomSignwritingHeadFaceSymbol,
} from "./tool.js";

describe("Random SignWriting Head and Face Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSignwritingHeadFaceSymbol(
        randomSignwritingHeadFaceSymbolExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "𝧿" } });
    expect(
      runRandomSignwritingHeadFaceSymbol(
        randomSignwritingHeadFaceSymbolExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𝩘" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSignwritingHeadFaceSymbolValueCount },
        (_, index) =>
          calculateRandomSignwritingHeadFaceSymbol(
            () => (index + 0.5) / randomSignwritingHeadFaceSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSignwritingHeadFaceSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomSignwritingHeadFaceSymbol({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
