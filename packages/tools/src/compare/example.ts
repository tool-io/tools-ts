import type { ToolExample } from "../core/example.js";

export const example = {
  input: {
    attributeDefinitions: [
      {
        canonicalUnit: "g",
        comparable: true,
        description: "Product mass.",
        id: "physical.mass",
        label: "Weight",
        order: 1,
        preference: "lower",
        quantity: "mass",
        section: "physical",
        type: "quantity",
      },
    ],
    categories: [],
    items: [
      {
        attributes: {
          "physical.mass": {
            sourceIds: ["manufacturer-a"],
            status: "known",
            type: "quantity",
            unit: "g",
            value: 170,
          },
        },
        categoryIds: ["smartphones"],
        id: "phone-a",
        image: null,
        name: "Phone A",
        schemaVersion: 1,
        slug: "phone-a",
        sourceIds: ["manufacturer-a"],
        summary: "Example smartphone.",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      {
        attributes: {
          "physical.mass": {
            sourceIds: ["manufacturer-b"],
            status: "known",
            type: "quantity",
            unit: "kg",
            value: 0.2,
          },
        },
        categoryIds: ["smartphones"],
        id: "phone-b",
        image: null,
        name: "Phone B",
        schemaVersion: 1,
        slug: "phone-b",
        sourceIds: ["manufacturer-b"],
        summary: "Second example smartphone.",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ],
  },
  output: {
    differenceCount: 1,
    itemIds: ["phone-a", "phone-b"],
    sections: [
      {
        id: "physical",
        rows: [
          {
            attributeId: "physical.mass",
            cells: [
              {
                comparison: "lower",
                display: "170 g",
                itemId: "phone-a",
                missingReason: null,
                normalizedValue: 170,
                status: "known",
              },
              {
                comparison: "higher",
                display: "0.2 kg",
                itemId: "phone-b",
                missingReason: null,
                normalizedValue: 200,
                status: "known",
              },
            ],
            description: "Product mass.",
            hasDifference: true,
            label: "Weight",
            preference: "lower",
          },
        ],
        title: "Physical",
      },
    ],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
