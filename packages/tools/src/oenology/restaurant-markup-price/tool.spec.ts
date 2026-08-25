import { describe, expect, it } from "vitest";
import {
  restaurantMarkupPriceExample,
  restaurantMarkupPriceTool,
  runRestaurantMarkupPrice,
} from "./tool.js";

describe("restaurantMarkupPriceTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runRestaurantMarkupPrice(restaurantMarkupPriceExample.input),
    ).toEqual({
      ok: true,
      output: restaurantMarkupPriceExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(restaurantMarkupPriceExample))).toEqual(
      restaurantMarkupPriceExample,
    );
    expect(restaurantMarkupPriceTool.contractVersion).toBe(1);
    expect(restaurantMarkupPriceTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runRestaurantMarkupPrice(null).ok).toBe(false);
    expect(
      runRestaurantMarkupPrice({
        ...restaurantMarkupPriceExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
