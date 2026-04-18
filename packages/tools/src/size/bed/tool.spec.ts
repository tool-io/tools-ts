import { describe, expect, it } from "vitest";

import { bedSizes, compareBedSizes, getBedSizesForMarket } from "./tool.js";

describe("bed size comparison", () => {
  it("compares a US queen by dimensions", () => {
    const result = compareBedSizes({ market: "us", size: "queen" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.input).toMatchObject({ lengthMm: 2032, widthMm: 1524 });
    expect(
      result.output.matches.find((match) => match.market === "uk")?.name,
    ).toBe("King");
  });

  it("keeps same names from being treated as equal dimensions", () => {
    const result = compareBedSizes({ market: "us", size: "king" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const uk = result.output.matches.find((match) => match.market === "uk");
    expect(uk?.name).toBe("Super King");
    expect(uk?.confidence).toBe("closest");
  });

  it("exposes independently usable market data", () => {
    expect(getBedSizesForMarket("eu")).toHaveLength(6);
    expect(
      bedSizes.every((entry) => entry.widthMm <= entry.lengthMm),
    ).toBe(true);
  });

  it("returns an explicit invalid result", () => {
    expect(compareBedSizes({ market: "us", size: "not-a-bed" }).ok).toBe(
      false,
    );
  });
});
