import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateMassLoadedVinylMlvStcSupplementLookup,
  example,
} from "./tool.js";

describe("acoustics/mlv-product-stc-lookup", () => {
  it("executes its canonical example exactly", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });

  it("converts one pound per square foot to SI surface mass", () => {
    const product = example.input.products[0];
    expect(
      calculateMassLoadedVinylMlvStcSupplementLookup({
        products: [{ ...product, surfaceMassPoundsPerSquareFoot: 1 }],
        queryProductId: product.productId,
      }),
    ).toMatchObject({
      combinedAssemblyStc: null,
      surfaceMassKgPerSquareMeter: 0.45359237,
    });
  });

  it("rejects an identifier absent from the supplied products", () => {
    expect(
      tool.execute({ ...example.input, queryProductId: "missing" }),
    ).toMatchObject({
      error: {
        issues: [{ code: "product_not_found", field: "queryProductId" }],
      },
      ok: false,
    });
  });
});
