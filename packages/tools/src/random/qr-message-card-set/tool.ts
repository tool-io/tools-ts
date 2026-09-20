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
import {
  generateQrCode,
  type QrCodeErrorCorrection,
} from "../../generate/qr-code/tool.js";
import type { CodeImageOutput } from "../../code-image/generate.js";
import {
  generatedCodeImageSchema,
  generatedCodeImage,
  checkGeneratedImageBudget,
} from "../code-image-construction.js";

export type QrMessageCardSetInput = {
  readonly templates: readonly string[];
  readonly count: number;
  readonly errorCorrection: QrCodeErrorCorrection;
  readonly scale: number;
  readonly seed?: number;
};
export type QrMessageCardSetOutput = {
  readonly cards: readonly {
    readonly index: number;
    readonly templateIndex: number;
    readonly template: string;
    readonly randomCode: string;
    readonly payload: string;
    readonly symbol: CodeImageOutput;
  }[];
  readonly duplicatePayloadPairs: readonly (readonly [number, number])[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    templates: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "string", minLength: 1, maxLength: 1024 },
    },
    count: { type: "integer", minimum: 1, maximum: 16 },
    errorCorrection: { type: "string", enum: ["L", "M", "Q", "H"] },
    scale: { type: "integer", minimum: 1, maximum: 10 },
    seed: generatorSeedSchema,
  },
  required: ["templates", "count", "errorCorrection", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cards: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          index: { type: "integer", minimum: 1, maximum: 16 },
          templateIndex: { type: "integer", minimum: 0, maximum: 15 },
          template: { type: "string", minLength: 1, maxLength: 1024 },
          randomCode: {
            type: "string",
            minLength: 6,
            maxLength: 6,
            pattern: "^[0-9]{6}(?![\\s\\S])",
          },
          payload: { type: "string", minLength: 1, maxLength: 1024 },
          symbol: generatedCodeImageSchema,
        },
        required: [
          "index",
          "templateIndex",
          "template",
          "randomCode",
          "payload",
          "symbol",
        ],
      },
    },
    duplicatePayloadPairs: {
      type: "array",
      maxItems: 120,
      items: {
        type: "array",
        minItems: 2,
        maxItems: 2,
        items: { type: "integer", minimum: 1, maximum: 16 },
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["cards", "duplicatePayloadPairs", "randomness"],
} as const;

const isInput = (input: unknown): input is QrMessageCardSetInput =>
  matchesModelInput(input, inputSchema);
export const calculateQrMessageCardSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<QrMessageCardSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      images: CodeImageOutput[] = [];
    const cards = Array.from({ length: input.count }, (_, i) => {
      const index = i + 1,
        templateIndex = random.integer(0, input.templates.length - 1),
        template = input.templates[templateIndex],
        randomCode = String(random.integer(0, 999999)).padStart(6, "0");
      const payload = template
        .replaceAll("{{index}}", String(index))
        .replaceAll("{{code}}", randomCode);
      const symbol = generatedCodeImage(
        () =>
          generateQrCode({
            text: payload,
            symbology: "qrcode",
            errorCorrection: input.errorCorrection,
            scale: input.scale,
            padding: 8,
          }),
        "templates",
      );
      images.push(symbol);
      checkGeneratedImageBudget(images, "count");
      return { index, templateIndex, template, randomCode, payload, symbol };
    });
    const duplicatePayloadPairs: [number, number][] = [];
    for (let i = 0; i < cards.length; i += 1)
      for (let j = i + 1; j < cards.length; j += 1)
        if (cards[i].payload === cards[j].payload)
          duplicatePayloadPairs.push([i + 1, j + 1]);
    return toolSuccess({
      cards,
      duplicatePayloadPairs,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const qrMessageCardSetExample = {
  input: {
    templates: ["Tool {{index}}/{{code}}"],
    count: 2,
    errorCorrection: "M",
    scale: 1,
    seed: 42,
  },
  output: {
    cards: [
      {
        index: 1,
        templateIndex: 0,
        template: "Tool {{index}}/{{code}}",
        randomCode: "448290",
        payload: "Tool 1/448290",
        symbol: {
          bcid: "qrcode",
          height: 58,
          svg: '<svg viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">\n<rect width="100%" height="100%" fill="#ffffff" />\n<path d="M8 50L22 50L22 36L8 36ZM24 50L26 50L26 48L24 48ZM32 50L40 50L40 46L38 46L38 48L34 48L34 46L30 46L30 48L32 48ZM46 50L48 50L48 48L46 48ZM10 48L10 38L20 38L20 48ZM44 48L46 48L46 44L44 44ZM12 46L18 46L18 40L12 40ZM24 46L26 46L26 44L28 44L28 42L26 42L26 40L28 40L28 42L30 42L30 38L24 38ZM28 46L30 46L30 44L28 44ZM32 44L34 44L34 42L38 42L38 40L40 40L40 42L42 42L42 40L46 40L46 38L44 38L44 34L42 34L42 38L38 38L38 36L36 36L36 38L34 38L34 34L32 34ZM38 44L40 44L40 42L38 42ZM42 44L44 44L44 42L42 42ZM46 42L48 42L48 40L46 40ZM46 38L48 38L48 32L46 32ZM24 36L28 36L28 30L32 30L32 28L30 28L30 26L24 26L24 28L26 28L26 30L22 30L22 32L20 32L20 34L24 34ZM10 34L16 34L16 32L10 32ZM30 34L32 34L32 32L30 32ZM36 34L38 34L38 32L36 32ZM8 32L10 32L10 30L16 30L16 32L18 32L18 30L22 30L22 28L20 28L20 26L22 26L22 24L12 24L12 28L10 28L10 24L8 24ZM34 32L36 32L36 30L34 30ZM42 32L46 32L46 30L44 30L44 26L46 26L46 24L36 24L36 26L40 26L40 30L42 30ZM36 30L38 30L38 28L36 28ZM46 30L48 30L48 28L46 28ZM14 28L14 26L18 26L18 28ZM32 28L34 28L34 16L30 16L30 18L32 18L32 22L30 22L30 24L32 24ZM48 28L50 28L50 26L48 26ZM24 24L28 24L28 22L26 22L26 14L28 14L28 12L32 12L32 10L30 10L30 8L26 8L26 12L24 12ZM8 22L22 22L22 8L8 8ZM28 22L30 22L30 20L28 20ZM36 22L50 22L50 8L36 8ZM10 20L10 10L20 10L20 20ZM38 20L38 10L48 10L48 20ZM12 18L18 18L18 12L12 12ZM40 18L46 18L46 12L40 12ZM32 10L34 10L34 8L32 8Z" fill-rule="evenodd" fill="#000000" />\n</svg>\n',
          symbology: "QR Code",
          width: 58,
        },
      },
      {
        index: 2,
        templateIndex: 0,
        template: "Tool {{index}}/{{code}}",
        randomCode: "669734",
        payload: "Tool 2/669734",
        symbol: {
          bcid: "qrcode",
          height: 58,
          svg: '<svg viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">\n<rect width="100%" height="100%" fill="#ffffff" />\n<path d="M8 50L22 50L22 36L8 36ZM24 50L32 50L32 46L30 46L30 48L24 48ZM34 50L36 50L36 48L34 48ZM38 50L40 50L40 46L36 46L36 48L38 48ZM46 50L48 50L48 48L46 48ZM10 48L10 38L20 38L20 48ZM44 48L46 48L46 44L44 44ZM12 46L18 46L18 40L12 40ZM24 46L28 46L28 44L30 44L30 36L28 36L28 38L24 38ZM32 46L34 46L34 44L40 44L40 42L36 42L36 38L34 38L34 36L36 36L36 34L32 34L32 40L34 40L34 42L32 42ZM42 44L44 44L44 42L42 42ZM40 42L42 42L42 40L46 40L46 38L44 38L44 34L42 34L42 38L38 38L38 40L40 40ZM46 42L48 42L48 40L46 40ZM46 38L48 38L48 32L46 32ZM24 36L28 36L28 30L26 30L26 32L20 32L20 34L24 34ZM10 34L12 34L12 30L10 30ZM14 34L18 34L18 32L16 32L16 30L18 30L18 28L12 28L12 30L14 30ZM30 34L32 34L32 32L30 32ZM36 34L38 34L38 32L46 32L46 30L44 30L44 26L46 26L46 24L36 24L36 26L40 26L40 30L38 30L38 28L36 28ZM20 30L26 30L26 28L24 28L24 26L22 26L22 28L20 28ZM28 30L32 30L32 28L28 28ZM46 30L48 30L48 28L46 28ZM8 28L12 28L12 26L10 26L10 24L8 24ZM32 28L34 28L34 12L32 12L32 10L30 10L30 8L26 8L26 12L30 12L30 14L32 14L32 16L30 16L30 18L32 18L32 22L30 22L30 24L32 24ZM48 28L50 28L50 26L48 26ZM12 26L22 26L22 24L12 24ZM24 24L26 24L26 18L28 18L28 16L30 16L30 14L26 14L26 12L24 12ZM8 22L22 22L22 8L8 8ZM28 22L30 22L30 20L28 20ZM36 22L50 22L50 8L36 8ZM10 20L10 10L20 10L20 20ZM38 20L38 10L48 10L48 20ZM12 18L18 18L18 12L12 12ZM40 18L46 18L46 12L40 12Z" fill-rule="evenodd" fill="#000000" />\n</svg>\n',
          symbology: "QR Code",
          width: 58,
        },
      },
    ],
    duplicatePayloadPairs: [],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<QrMessageCardSetInput, QrMessageCardSetOutput>;
export const qrMessageCardSetTool = createModelDefinition<
  QrMessageCardSetInput,
  QrMessageCardSetOutput
>({
  id: "random/qr-message-card-set",
  title: "Random QR Message Card Set Generator",
  description:
    "Sample supplied synthetic message templates, replace literal {{index}} and {{code}} tokens with a one-based card index and six random decimal digits, and delegate standard QR SVG symbols with explicit error correction; other text is literal, duplicates are reported, capacity failures stay structured, and app layout/print export are separate.",
  inputSchema,
  outputSchema,
  execute: calculateQrMessageCardSet,
});
export const runQrMessageCardSet = qrMessageCardSetTool.execute;
export default qrMessageCardSetTool;
