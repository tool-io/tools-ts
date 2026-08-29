import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    profile: "women",
    size: 8,
    system: "us",
  },
  output: {
    footLengthMm: 249.7666666666667,
    input: {
      label: "8",
      system: "us",
    },
    matches: [
      {
        confidence: "exact",
        label: "250",
        markets: ["International", "NATO"],
        system: "mondopoint",
      },
      {
        confidence: "recommended",
        label: "39.5",
        markets: ["EU", "Germany", "France", "Italy", "Spain"],
        system: "eu",
      },
      {
        confidence: "recommended",
        label: "6",
        markets: ["United Kingdom"],
        system: "uk",
      },
      {
        confidence: "recommended",
        label: "8",
        markets: ["United States", "Canada"],
        system: "us",
      },
      {
        confidence: "exact",
        label: "25",
        markets: ["Japan"],
        system: "jp",
      },
      {
        confidence: "exact",
        label: "250",
        markets: ["China"],
        system: "cn",
      },
      {
        confidence: "exact",
        label: "250",
        markets: ["South Korea"],
        system: "kr",
      },
    ],
    profile: "women",
    warning:
      "Recommended conversion only. Shoe lasts, toe allowance, width, and brand fit vary.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
