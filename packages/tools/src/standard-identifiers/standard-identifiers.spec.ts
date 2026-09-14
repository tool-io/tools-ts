import { describe, expect, it } from "vitest";
import { calculateUpcAToUpcE } from "../convert/upc-a-to-upc-e/tool.js";
import { calculateUpcEToUpcA } from "../convert/upc-e-to-upc-a/tool.js";
import { loadToolModule } from "../registry.js";
import { calculateValidateGtin } from "../validate/gtin/tool.js";
import { calculateValidateUpcE } from "../validate/upc-e/tool.js";
import { gs1CheckDigit, isbn10CheckDigit, issnCheckDigit } from "./shared.js";

const addedIds = [
  "generate/isbn-10",
  "generate/isbn-13",
  "generate/ean-8",
  "generate/ean-13",
  "generate/upc-a",
  "generate/gtin-14",
  "generate/issn",
  "generate/ismn-10",
  "generate/ismn-13",
  "generate/jan",
  "validate/ean-8",
  "validate/ean-13",
  "validate/upc-a",
  "validate/upc-e",
  "validate/gtin",
  "validate/issn",
  "validate/ismn",
  "validate/jan",
  "convert/upc-a-to-upc-e",
  "convert/upc-e-to-upc-a",
] as const;

describe("standard publication and product identifiers", () => {
  it("matches official check digit examples", () => {
    expect(gs1CheckDigit("400638133393")).toBe("1");
    expect(gs1CheckDigit("03600029145")).toBe("2");
    expect(isbn10CheckDigit("030640615")).toBe("2");
    expect(issnCheckDigit("0317847")).toBe("1");
  });

  it("round-trips a compressible UPC-A and rejects a bad check digit", () => {
    expect(calculateUpcAToUpcE({ upcA: "042100005264" })).toEqual({
      ok: true,
      output: { upcE: "04252614" },
    });
    expect(calculateUpcEToUpcA({ upcE: "04252614" })).toEqual({
      ok: true,
      output: { upcA: "042100005264" },
    });
    expect(calculateValidateUpcE({ identifier: "04252615" })).toMatchObject({
      ok: true,
      output: { valid: false },
    });
  });

  it("classifies all four GTIN lengths", () => {
    for (const [identifier, type] of [
      ["96385074", "GTIN-8"],
      ["036000291452", "GTIN-12"],
      ["4006381333931", "GTIN-13"],
      ["10614141123459", "GTIN-14"],
    ] as const)
      expect(calculateValidateGtin({ identifier })).toMatchObject({
        ok: true,
        output: { type, valid: true },
      });
  });

  it("publishes executable canonical examples for the complete family", async () => {
    expect(addedIds).toHaveLength(20);
    const modules = await Promise.all(
      addedIds.map(async (id) => [id, await loadToolModule(id)] as const),
    );

    for (const [id, module] of modules) {
      expect(module, id).toBeDefined();
      expect(module!.default.execute(module!.example!.input), id).toEqual({
        ok: true,
        output: module!.example!.output,
      });
    }
  }, 15_000);
});
