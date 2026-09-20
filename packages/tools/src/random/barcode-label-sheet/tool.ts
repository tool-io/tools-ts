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
import { runIdentifierGenerator as runEan13Identifier } from "../../generate/ean-13/tool.js";
import { runIdentifierGenerator as runUpcAIdentifier } from "../../generate/upc-a/tool.js";
import { generateBarcode } from "../../generate/barcode/tool.js";
import type { CodeImageOutput } from "../../code-image/generate.js";
import { generatorSampleIndices } from "../generator-random.js";
import {
  generatedCodeImageSchema,
  generatedCodeImage,
  checkGeneratedImageBudget,
} from "../code-image-construction.js";

export type BarcodeLabelSheetInput = {
  readonly format: "ean13" | "upca";
  readonly prefix: string;
  readonly count: number;
  readonly unique: boolean;
  readonly columns: number;
  readonly scale: number;
  readonly heightMillimeters: number;
  readonly includeText: boolean;
  readonly seed?: number;
};
export type BarcodeLabelSheetOutput = {
  readonly grid: { readonly columns: number; readonly rows: number };
  readonly labels: readonly {
    readonly row: number;
    readonly column: number;
    readonly dataDigits: string;
    readonly identifier: string;
    readonly checkDigit: string;
    readonly barcode: CodeImageOutput;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    format: { type: "string", enum: ["ean13", "upca"] },
    prefix: { type: "string", maxLength: 12, pattern: "^[0-9]*(?![\\s\\S])" },
    count: { type: "integer", minimum: 1, maximum: 64 },
    unique: { type: "boolean" },
    columns: { type: "integer", minimum: 1, maximum: 8 },
    scale: { type: "integer", minimum: 1, maximum: 10 },
    heightMillimeters: { type: "number", minimum: 1, maximum: 100 },
    includeText: { type: "boolean" },
    seed: generatorSeedSchema,
  },
  required: [
    "format",
    "prefix",
    "count",
    "unique",
    "columns",
    "scale",
    "heightMillimeters",
    "includeText",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grid: {
      type: "object",
      additionalProperties: false,
      properties: {
        columns: { type: "integer", minimum: 1, maximum: 8 },
        rows: { type: "integer", minimum: 1, maximum: 64 },
      },
      required: ["columns", "rows"],
    },
    labels: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          row: { type: "integer", minimum: 0, maximum: 63 },
          column: { type: "integer", minimum: 0, maximum: 7 },
          dataDigits: {
            type: "string",
            minLength: 11,
            maxLength: 12,
            pattern: "^[0-9]+(?![\\s\\S])",
          },
          identifier: {
            type: "string",
            minLength: 12,
            maxLength: 13,
            pattern: "^[0-9]+(?![\\s\\S])",
          },
          checkDigit: {
            type: "string",
            minLength: 1,
            maxLength: 1,
            pattern: "^[0-9](?![\\s\\S])",
          },
          barcode: generatedCodeImageSchema,
        },
        required: [
          "row",
          "column",
          "dataDigits",
          "identifier",
          "checkDigit",
          "barcode",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["grid", "labels", "randomness"],
} as const;

const isInput = (input: unknown): input is BarcodeLabelSheetInput =>
  matchesModelInput(input, inputSchema);
export const calculateBarcodeLabelSheet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BarcodeLabelSheetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const dataLength = input.format === "ean13" ? 12 : 11;
    if (input.prefix.length > dataLength)
      simpleError(
        "prefix",
        "The digit prefix cannot exceed the selected identifier's data length.",
        "prefix_too_long",
      );
    const suffixLength = dataLength - input.prefix.length,
      population = 10 ** suffixLength;
    if (input.unique && input.count > population)
      simpleError(
        "count",
        "The requested unique identifiers exceed the prefix's available suffix population.",
        "insufficient_identifiers",
      );
    const random = createGeneratorRandom(input.seed, context),
      indices = input.unique
        ? generatorSampleIndices(population, input.count, random)
        : Array.from({ length: input.count }, () =>
            random.integer(0, population - 1),
          );
    const labels = indices.map((index, position) => {
      const dataDigits =
        input.prefix +
        (suffixLength ? String(index).padStart(suffixLength, "0") : "");
      const result = (
        input.format === "ean13" ? runEan13Identifier : runUpcAIdentifier
      )({ dataDigits });
      if (!result.ok)
        throw new Error(
          "Generated exact-length decimal data was rejected by an identifier core.",
        );
      const barcode = generatedCodeImage(
        () =>
          generateBarcode({
            symbology: input.format,
            text: result.output.identifier,
            scale: input.scale,
            heightMillimeters: input.heightMillimeters,
            includeText: input.includeText,
            padding: 4,
            rotation: "N",
          }),
        "format",
      );
      return {
        row: Math.floor(position / input.columns),
        column: position % input.columns,
        dataDigits,
        identifier: result.output.identifier,
        checkDigit: result.output.checkDigit,
        barcode,
      };
    });
    checkGeneratedImageBudget(
      labels.map((label) => label.barcode),
      "count",
    );
    return toolSuccess({
      grid: {
        columns: input.columns,
        rows: Math.ceil(input.count / input.columns),
      },
      labels,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const barcodeLabelSheetExample = {
  input: {
    format: "ean13",
    prefix: "400",
    count: 2,
    unique: true,
    columns: 2,
    scale: 1,
    heightMillimeters: 12,
    includeText: false,
    seed: 42,
  },
  output: {
    grid: {
      columns: 2,
      rows: 1,
    },
    labels: [
      {
        row: 0,
        column: 0,
        dataDigits: "400601103751",
        identifier: "4006011037512",
        checkDigit: "2",
        barcode: {
          bcid: "ean13",
          height: 52,
          svg: '<svg viewBox="0 0 112 52" xmlns="http://www.w3.org/2000/svg">\n<rect width="100%" height="100%" fill="#ffffff" />\n<path stroke="#000000" stroke-width="1" d="M4.50 39L4.50 4M6.50 39L6.50 4M13.50 39L13.50 4M15.50 39L15.50 4M22.50 39L22.50 4M34.50 39L34.50 4M50.50 39L50.50 4M52.50 39L52.50 4M59.50 39L59.50 4M61.50 39L61.50 4M66.50 39L66.50 4M68.50 39L68.50 4M72.50 39L72.50 4M75.50 39L75.50 4M96.50 39L96.50 4M98.50 39L98.50 4" />\n<path stroke="#000000" stroke-width="2" d="M11 39L11 4M32 39L32 4M37 39L37 4M41 39L41 4M44 39L44 4M48 39L48 4M83 39L83 4M87 39L87 4M90 39L90 4M93 39L93 4" />\n<path stroke="#000000" stroke-width="3" d="M19.50 39L19.50 4M55.50 39L55.50 4M79.50 39L79.50 4" />\n<path stroke="#000000" stroke-width="4" d="M26 39L26 4" />\n<path d="M106.89 42.77L101.71 46.06Q101.57 46.16 101.39 46.16Q101.16 46.16 100.99 46.00Q100.82 45.83 100.82 45.61Q100.82 45.40 100.99 45.23L105.43 42.38L100.99 39.54Q100.82 39.43 100.82 39.15Q100.82 38.93 100.99 38.77Q101.16 38.60 101.39 38.60Q101.57 38.60 101.71 38.70Q101.71 38.70 101.71 38.70L106.89 41.99Q107.06 42.19 107.06 42.39Q107.06 42.61 106.89 42.77Z" fill="#000000" />\n</svg>\n',
          symbology: "EAN-13",
          width: 112,
        },
      },
      {
        row: 0,
        column: 1,
        dataDigits: "400448290558",
        identifier: "4004482905583",
        checkDigit: "3",
        barcode: {
          bcid: "ean13",
          height: 52,
          svg: '<svg viewBox="0 0 112 52" xmlns="http://www.w3.org/2000/svg">\n<rect width="100%" height="100%" fill="#ffffff" />\n<path stroke="#000000" stroke-width="1" d="M4.50 39L4.50 4M6.50 39L6.50 4M13.50 39L13.50 4M15.50 39L15.50 4M22.50 39L22.50 4M29.50 39L29.50 4M38.50 39L38.50 4M41.50 39L41.50 4M50.50 39L50.50 4M52.50 39L52.50 4M58.50 39L58.50 4M66.50 39L66.50 4M68.50 39L68.50 4M75.50 39L75.50 4M82.50 39L82.50 4M85.50 39L85.50 4M89.50 39L89.50 4M94.50 39L94.50 4M96.50 39L96.50 4M98.50 39L98.50 4" />\n<path stroke="#000000" stroke-width="2" d="M11 39L11 4M27 39L27 4M34 39L34 4M45 39L45 4M48 39L48 4" />\n<path stroke="#000000" stroke-width="3" d="M19.50 39L19.50 4M55.50 39L55.50 4M62.50 39L62.50 4M72.50 39L72.50 4M79.50 39L79.50 4" />\n<path d="M106.89 42.77L101.71 46.06Q101.57 46.16 101.39 46.16Q101.16 46.16 100.99 46.00Q100.82 45.83 100.82 45.61Q100.82 45.40 100.99 45.23L105.43 42.38L100.99 39.54Q100.82 39.43 100.82 39.15Q100.82 38.93 100.99 38.77Q101.16 38.60 101.39 38.60Q101.57 38.60 101.71 38.70Q101.71 38.70 101.71 38.70L106.89 41.99Q107.06 42.19 107.06 42.39Q107.06 42.61 106.89 42.77Z" fill="#000000" />\n</svg>\n',
          symbology: "EAN-13",
          width: 112,
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<BarcodeLabelSheetInput, BarcodeLabelSheetOutput>;
export const barcodeLabelSheetTool = createModelDefinition<
  BarcodeLabelSheetInput,
  BarcodeLabelSheetOutput
>({
  id: "random/barcode-label-sheet",
  title: "Random Barcode Label Sheet Generator",
  description:
    "Generate seeded synthetic EAN-13 or UPC-A data under an optional digit prefix, delegate check digits and SVG symbols, and return bounded zero-based label-grid positions for an app-rendered sheet; optional uniqueness applies to identifiers, while assignment, physical scanner readiness, print layout and export are not claimed.",
  inputSchema,
  outputSchema,
  execute: calculateBarcodeLabelSheet,
});
export const runBarcodeLabelSheet = barcodeLabelSheetTool.execute;
export default barcodeLabelSheetTool;
