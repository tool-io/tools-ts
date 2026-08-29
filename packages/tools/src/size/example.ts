import type { ToolExample } from "../core/example.js";

export const example = {
  input: {
    item: "bed",
    market: "us",
    size: "queen",
  },
  output: {
    item: "bed",
    input: {
      id: "queen",
      lengthMm: 2032,
      market: "us",
      name: "Queen",
      widthMm: 1524,
    },
    matches: [
      {
        id: "queen",
        lengthMm: 2030,
        market: "au",
        name: "Queen",
        widthMm: 1530,
        confidence: "exact",
        differenceMm: 8,
      },
      {
        id: "160x200",
        lengthMm: 2000,
        market: "eu",
        name: "160 × 200",
        widthMm: 1600,
        confidence: "closest",
        differenceMm: 108,
      },
      {
        id: "queen",
        lengthMm: 1950,
        market: "jp",
        name: "Queen",
        widthMm: 1600,
        confidence: "closest",
        differenceMm: 158,
      },
      {
        id: "king",
        lengthMm: 2000,
        market: "uk",
        name: "King",
        widthMm: 1500,
        confidence: "closest",
        differenceMm: 56,
      },
      {
        id: "queen",
        lengthMm: 2032,
        market: "us",
        name: "Queen",
        widthMm: 1524,
        confidence: "exact",
        differenceMm: 0,
      },
    ],
    warning:
      "Named bed sizes are regional conventions. Check the manufacturer’s finished mattress and frame dimensions before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
