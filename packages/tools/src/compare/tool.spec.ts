import { describe, expect, it } from "vitest";
import {
  compareCatalogItems,
  type AttributeDefinition,
  type CatalogItem,
} from "./tool.js";

const definitions: AttributeDefinition[] = [
  {
    canonicalUnit: "g",
    comparable: true,
    description: "Mass.",
    id: "physical.mass",
    label: "Weight",
    order: 1,
    preference: "lower",
    quantity: "mass",
    section: "design-and-body",
    type: "quantity",
  },
  {
    canonicalUnit: "mm",
    comparable: true,
    description: "Height.",
    id: "physical.height",
    label: "Height",
    order: 2,
    preference: "none",
    quantity: "length",
    section: "design-and-body",
    type: "quantity",
  },
  {
    canonicalUnit: null,
    comparable: false,
    description: "Display.",
    id: "display.name",
    label: "Display",
    order: 3,
    preference: "none",
    quantity: "none",
    section: "display",
    type: "text",
  },
];
const item = (
  id: string,
  attributes: CatalogItem["attributes"],
): CatalogItem => ({
  attributes,
  categoryIds: [],
  id,
  image: null,
  name: id,
  schemaVersion: 1,
  slug: id,
  sourceIds: [],
  summary: "",
  updatedAt: "2026-08-09T00:00:00Z",
});
const value = (amount: number, unit: string) => ({
  sourceIds: [],
  status: "known" as const,
  type: "quantity" as const,
  unit,
  value: amount,
});

describe("compare catalog items", () => {
  it("normalizes units and includes missing cross-category values", () => {
    const result = compareCatalogItems({
      attributeDefinitions: definitions,
      categories: [],
      items: [
        item("banana", {
          "physical.mass": value(118, "g"),
          "physical.height": value(18, "cm"),
        }),
        item("phone", {
          "physical.mass": value(0.17, "kg"),
          "display.name": {
            sourceIds: [],
            status: "known",
            type: "text",
            unit: null,
            value: "OLED",
          },
        }),
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.sections).toHaveLength(2);
    expect(
      result.output.sections[0]?.rows[0]?.cells.map(
        (cell) => cell.normalizedValue,
      ),
    ).toEqual([118, 170]);
    expect(result.output.sections[1]?.rows[0]?.cells[0]?.missingReason).toBe(
      "unknown",
    );
  });
  it("rejects duplicate and insufficient item counts", () => {
    const banana = item("banana", {});
    expect(
      compareCatalogItems({
        attributeDefinitions: definitions,
        categories: [],
        items: [banana],
      }).ok,
    ).toBe(false);
    expect(
      compareCatalogItems({
        attributeDefinitions: definitions,
        categories: [],
        items: [banana, banana],
      }).ok,
    ).toBe(false);
  });

  it("supports comparisons containing more than four items", () => {
    const items = Array.from({ length: 6 }, (_, index) =>
      item(`item-${index}`, {
        "physical.mass": value(100 + index, "g"),
      })
    );
    const result = compareCatalogItems({
      attributeDefinitions: definitions,
      categories: [],
      items,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.itemIds).toHaveLength(6);
    expect(result.output.sections[0]?.rows[0]?.cells).toHaveLength(6);
  });
});
