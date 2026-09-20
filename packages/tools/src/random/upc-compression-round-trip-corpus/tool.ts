import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { runIdentifierGenerator as generateUpcA } from "../../generate/upc-a/tool.js";
import { calculateUpcAToUpcE } from "../../convert/upc-a-to-upc-e/tool.js";
import { calculateUpcEToUpcA } from "../../convert/upc-e-to-upc-a/tool.js";

export type UpcCompressionFamily =
  "last-digit-0-2" | "last-digit-3" | "last-digit-4" | "last-digit-5-9";
export type UpcCompressionRoundTripCorpusInput = {
  readonly numberSystem: "0" | "1";
  readonly manufacturerPrefix: string;
  readonly families: readonly UpcCompressionFamily[];
  readonly compressibleCount: number;
  readonly noncompressibleCount: number;
  readonly seed?: number;
};
export type UpcCompressionRoundTripCorpusOutput = {
  readonly cases: readonly {
    readonly family: UpcCompressionFamily | "noncompressible";
    readonly manufacturer: string;
    readonly product: string;
    readonly upcA: string;
    readonly conversion: {
      readonly compressible: boolean;
      readonly upcE: string | null;
      readonly expandedUpcA: string | null;
      readonly roundTripVerified: boolean | null;
    };
  }[];
  readonly randomness: GeneratorReplay;
};
const families = [
  "last-digit-0-2",
  "last-digit-3",
  "last-digit-4",
  "last-digit-5-9",
] as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numberSystem: { type: "string", enum: ["0", "1"] },
    manufacturerPrefix: {
      type: "string",
      maxLength: 5,
      pattern: "^[0-9]*(?![\\s\\S])",
    },
    families: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: { type: "string", enum: families },
    },
    compressibleCount: { type: "integer", minimum: 0, maximum: 64 },
    noncompressibleCount: { type: "integer", minimum: 0, maximum: 64 },
    seed: generatorSeedSchema,
  },
  required: [
    "numberSystem",
    "manufacturerPrefix",
    "families",
    "compressibleCount",
    "noncompressibleCount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cases: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          family: { type: "string", enum: [...families, "noncompressible"] },
          manufacturer: { type: "string", minLength: 5, maxLength: 5 },
          product: { type: "string", minLength: 5, maxLength: 5 },
          upcA: { type: "string", minLength: 12, maxLength: 12 },
          conversion: {
            type: "object",
            additionalProperties: false,
            properties: {
              compressible: { type: "boolean" },
              upcE: {
                anyOf: [
                  { type: "string", minLength: 8, maxLength: 8 },
                  { type: "null" },
                ],
              },
              expandedUpcA: {
                anyOf: [
                  { type: "string", minLength: 12, maxLength: 12 },
                  { type: "null" },
                ],
              },
              roundTripVerified: {
                anyOf: [{ type: "boolean" }, { type: "null" }],
              },
            },
            required: [
              "compressible",
              "upcE",
              "expandedUpcA",
              "roundTripVerified",
            ],
          },
        },
        required: ["family", "manufacturer", "product", "upcA", "conversion"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["cases", "randomness"],
} as const;
const manufacturerRanges: Readonly<
  Record<
    UpcCompressionFamily | "noncompressible",
    readonly (readonly [number, number])[]
  >
> = {
  "last-digit-0-2": [
    [0, 9],
    [0, 9],
    [0, 2],
    [0, 0],
    [0, 0],
  ],
  "last-digit-3": [
    [0, 9],
    [0, 9],
    [3, 9],
    [0, 0],
    [0, 0],
  ],
  "last-digit-4": [
    [0, 9],
    [0, 9],
    [0, 9],
    [1, 9],
    [0, 0],
  ],
  "last-digit-5-9": [
    [0, 9],
    [0, 9],
    [0, 9],
    [0, 9],
    [1, 9],
  ],
  noncompressible: [
    [0, 9],
    [0, 9],
    [0, 9],
    [0, 9],
    [1, 9],
  ],
};
const isInput = (input: unknown): input is UpcCompressionRoundTripCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateUpcCompressionRoundTripCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<UpcCompressionRoundTripCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.families).size !== input.families.length)
      simpleError("families", "Entries must be distinct.", "duplicate_entries");
    if (input.compressibleCount + input.noncompressibleCount === 0)
      simpleError(
        "compressibleCount",
        "Request at least one case.",
        "empty_corpus",
      );
    const requested: (UpcCompressionFamily | "noncompressible")[] = [
      ...(input.compressibleCount ? input.families : []),
      ...(input.noncompressibleCount ? ["noncompressible" as const] : []),
    ];
    for (const family of requested)
      for (let i = 0; i < input.manufacturerPrefix.length; i += 1) {
        const digit = Number(input.manufacturerPrefix[i]),
          [low, high] = manufacturerRanges[family][i];
        if (digit < low || digit > high)
          simpleError(
            "manufacturerPrefix",
            "The prefix must fit every requested disjoint family.",
            "incompatible_prefix",
          );
      }
    const random = createGeneratorRandom(input.seed, context);
    const makeCase = (
      family: UpcCompressionFamily | "noncompressible",
    ): UpcCompressionRoundTripCorpusOutput["cases"][number] => {
      const manufacturer = manufacturerRanges[family]
        .map(
          ([low, high], i) =>
            input.manufacturerPrefix[i] ?? String(random.integer(low, high)),
        )
        .join("");
      const digits = (n: number): string =>
        Array.from({ length: n }, () => String(random.integer(0, 9))).join("");
      const product =
        family === "last-digit-0-2"
          ? "00" + digits(3)
          : family === "last-digit-3"
            ? "000" + digits(2)
            : family === "last-digit-4"
              ? "0000" + digits(1)
              : family === "last-digit-5-9"
                ? "0000" + random.integer(5, 9)
                : String(random.integer(1, 9)) + digits(4);
      const generated = generateUpcA({
        dataDigits: input.numberSystem + manufacturer + product,
      });
      if (!generated.ok) throw new Error("Constructed UPC-A was rejected.");
      const upcA = generated.output.identifier,
        compressed = calculateUpcAToUpcE({ upcA });
      if (family === "noncompressible") {
        if (compressed.ok)
          throw new Error("A noncompressible control unexpectedly compressed.");
        return {
          family,
          manufacturer,
          product,
          upcA,
          conversion: {
            compressible: false,
            upcE: null,
            expandedUpcA: null,
            roundTripVerified: null,
          },
        };
      }
      if (!compressed.ok)
        throw new Error("A zero-suppression family failed compression.");
      const expanded = calculateUpcEToUpcA({ upcE: compressed.output.upcE });
      if (!expanded.ok) throw new Error("A generated UPC-E failed expansion.");
      return {
        family,
        manufacturer,
        product,
        upcA,
        conversion: {
          compressible: true,
          upcE: compressed.output.upcE,
          expandedUpcA: expanded.output.upcA,
          roundTripVerified: expanded.output.upcA === upcA,
        },
      };
    };
    const cases = [
      ...Array.from({ length: input.compressibleCount }, () =>
        makeCase(random.pick(input.families)),
      ),
      ...Array.from({ length: input.noncompressibleCount }, () =>
        makeCase("noncompressible"),
      ),
    ];
    return toolSuccess({
      cases: random.shuffle(cases),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const upcCompressionRoundTripCorpusExample = {
  input: {
    numberSystem: "0",
    manufacturerPrefix: "",
    families: [
      "last-digit-0-2",
      "last-digit-3",
      "last-digit-4",
      "last-digit-5-9",
    ],
    compressibleCount: 2,
    noncompressibleCount: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        family: "last-digit-4",
        manufacturer: "84280",
        product: "00003",
        upcA: "084280000035",
        conversion: {
          compressible: true,
          upcE: "08428345",
          expandedUpcA: "084280000035",
          roundTripVerified: true,
        },
      },
      {
        family: "noncompressible",
        manufacturer: "15661",
        product: "58050",
        upcA: "015661580501",
        conversion: {
          compressible: false,
          upcE: null,
          expandedUpcA: null,
          roundTripVerified: null,
        },
      },
      {
        family: "last-digit-4",
        manufacturer: "48620",
        product: "00002",
        upcA: "048620000024",
        conversion: {
          compressible: true,
          upcE: "04862244",
          expandedUpcA: "048620000024",
          roundTripVerified: true,
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  UpcCompressionRoundTripCorpusInput,
  UpcCompressionRoundTripCorpusOutput
>;
export const upcCompressionRoundTripCorpusTool = createModelDefinition<
  UpcCompressionRoundTripCorpusInput,
  UpcCompressionRoundTripCorpusOutput
>({
  id: "random/upc-compression-round-trip-corpus",
  title: "Random UPC Compression Round-Trip Corpus Generator",
  description:
    "Construct synthetic UPC-A cases from four disjoint zero-suppression families plus guaranteed noncompressible controls, delegate check digits and both conversions, and return observed round trips; prefixes must fit every requested family, cases may repeat, and no product allocation is implied.",
  inputSchema,
  outputSchema,
  execute: calculateUpcCompressionRoundTripCorpus,
});
export const runUpcCompressionRoundTripCorpus =
  upcCompressionRoundTripCorpusTool.execute;
export default upcCompressionRoundTripCorpusTool;
