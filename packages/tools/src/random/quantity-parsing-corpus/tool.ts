import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import { invalidInput, type ToolResult } from "../../core/result.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "../generator-random.js";
import { parseQuantity } from "../../parse/quantity/tool.js";
import { parsePercentage } from "../../parse/percentage/tool.js";
import { parseFeetAndInches } from "../../parse/feet-and-inches/tool.js";
import { simpleError } from "../../core/simple.js";
import {
  mocksArray,
  mocksObject,
  mocksInteger,
  mocksNumber,
  mocksText,
  mocksBoolean,
  mocksNullable,
  mocksPick,
  mocksOrdered,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type QuantityParsingCorpusInput = {
  readonly units: readonly string[];
  readonly minimumWhole: number;
  readonly maximumWhole: number;
  readonly count: number;
  readonly seed?: number;
};
export type QuantityParsingCorpusOutput = {
  readonly cases: readonly {
    readonly kind: "quantity" | "percentage" | "feet-and-inches";
    readonly control: boolean;
    readonly text: string;
    readonly accepted: boolean;
    readonly value: number | null;
    readonly unit: string;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = mocksObject(
  {
    units: mocksArray({ type: "string", minLength: 1, maxLength: 64 }, 128, 1),
    minimumWhole: { ...mocksInteger, minimum: 0 },
    maximumWhole: { ...mocksInteger, minimum: 0 },
    count: { type: "integer", minimum: 1, maximum: 128 },
    seed: generatorSeedSchema,
  },
  ["units", "minimumWhole", "maximumWhole", "count"],
);
export const outputSchema = mocksObject({
  cases: mocksArray(
    mocksObject({
      kind: {
        type: "string",
        enum: ["quantity", "percentage", "feet-and-inches"],
      },
      control: mocksBoolean,
      text: mocksText,
      accepted: mocksBoolean,
      value: mocksNullable(mocksNumber),
      unit: mocksText,
    }),
    768,
    6,
  ),
  randomness: generatorReplaySchema,
});
const generate = (
  input: QuantityParsingCorpusInput,
  random: GeneratorRandom,
): Omit<QuantityParsingCorpusOutput, "randomness"> => {
  mocksOrdered(input.minimumWhole, input.maximumWhole, "maximumWhole");
  for (const unit of input.units)
    if (
      !parseQuantity("1 " + unit) ||
      parseQuantity("1 " + unit)?.unit !== unit
    )
      simpleError(
        "units",
        "Each supplied unit must be preserved by the quantity parser.",
        "unsupported_unit_spelling",
      );
  const cases: QuantityParsingCorpusOutput["cases"][number][] = [];
  for (let i = 0; i < input.count; i += 1) {
    const whole = random.integer(input.minimumWhole, input.maximumWhole),
      digit = random.integer(0, 9),
      unit = mocksPick(input.units, random);
    const numberText = String(whole) + "." + digit;
    for (const [kind, text, control] of [
      ["quantity", numberText + " " + unit, false],
      ["quantity", numberText, true],
      ["percentage", numberText + "%", false],
      ["percentage", numberText + "%x", true],
      ["feet-and-inches", whole + " ft " + digit + " in", false],
      ["feet-and-inches", whole + " ft x in", true],
    ] as const) {
      const quantity = kind === "quantity" ? parseQuantity(text) : null;
      const value =
        kind === "quantity"
          ? (quantity?.value ?? null)
          : kind === "percentage"
            ? parsePercentage(text)
            : parseFeetAndInches(text);
      cases.push({
        kind,
        control,
        text,
        accepted: value !== null,
        value,
        unit:
          kind === "quantity"
            ? (quantity?.unit ?? "")
            : kind === "percentage"
              ? "fraction"
              : "in",
      });
    }
  }
  return { cases };
};
export const quantityParsingCorpusExample = {
  input: {
    units: ["kg", "m/s"],
    minimumWhole: 0,
    maximumWhole: 99,
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        kind: "quantity",
        control: false,
        text: "60.4 m/s",
        accepted: true,
        value: 60.4,
        unit: "m/s",
      },
      {
        kind: "quantity",
        control: true,
        text: "60.4",
        accepted: false,
        value: null,
        unit: "",
      },
      {
        kind: "percentage",
        control: false,
        text: "60.4%",
        accepted: true,
        value: 0.604,
        unit: "fraction",
      },
      {
        kind: "percentage",
        control: true,
        text: "60.4%x",
        accepted: false,
        value: null,
        unit: "fraction",
      },
      {
        kind: "feet-and-inches",
        control: false,
        text: "60 ft 4 in",
        accepted: true,
        value: 724,
        unit: "in",
      },
      {
        kind: "feet-and-inches",
        control: true,
        text: "60 ft x in",
        accepted: false,
        value: null,
        unit: "in",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  QuantityParsingCorpusInput,
  QuantityParsingCorpusOutput
>;

const isInput = (input: unknown): input is QuantityParsingCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateQuantityParsingCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<QuantityParsingCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    return mocksFinish(
      {
        ...generate(input, random),
        randomness: generatorReplay(input.seed, context),
      },
      outputSchema,
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const quantityParsingCorpusTool = createModelDefinition<
  QuantityParsingCorpusInput,
  QuantityParsingCorpusOutput
>({
  id: "random/quantity-parsing-corpus",
  title: "Random Quantity Parsing Corpus Generator",
  description:
    "Generate unit, percentage, and feet-and-inches spellings with malformed controls and delegated normalized values without unit conversion.",
  inputSchema,
  outputSchema,
  execute: calculateQuantityParsingCorpus,
});
export const runQuantityParsingCorpus = quantityParsingCorpusTool.execute;
export default quantityParsingCorpusTool;
