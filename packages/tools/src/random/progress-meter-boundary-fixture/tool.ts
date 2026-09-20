import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  text,
  label,
  id,
  bool,
  number,
  integer,
  list,
  object,
  enumeration,
  nullable,
  markup,
  parsedSchema,
  choose,
  preview,
  distinct,
  work,
  finite,
  escape,
  parse,
  finish,
} from "../m500b-ui-accessibility-support.js";
import {
  calculateProgressValueMaxPercent,
  progressValueMaxPercentOutputSchema,
  type ProgressValueMaxPercentOutput,
} from "../../html/progress-value-max-percent/tool.js";
import {
  calculateMeterOptimumLowHighBandClassifier,
  meterOptimumLowHighBandClassifierOutputSchema,
  type MeterOptimumLowHighBandClassifierOutput,
} from "../../html/meter-optimum-low-high-band-classifier/tool.js";

type Progress = {
  readonly hasValue: boolean;
  readonly value: number;
  readonly max: number;
};
type Meter = {
  readonly value: number;
  readonly min: number;
  readonly low: number;
  readonly high: number;
  readonly max: number;
  readonly optimum: number;
};
export type Input = {
  readonly progress: Progress;
  readonly meter: Meter;
  readonly modes: readonly (
    "valid" | "below" | "above" | "reversed" | "indeterminate"
  )[];
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly cases: readonly {
    readonly mode: "valid" | "below" | "above" | "reversed" | "indeterminate";
    readonly progress: Progress;
    readonly meter: Meter;
    readonly progressResult: ProgressValueMaxPercentOutput;
    readonly meterResult: MeterOptimumLowHighBandClassifierOutput | null;
    readonly meterError: {
      readonly field: string;
      readonly code: string;
    } | null;
    readonly html: string;
  }[];
  readonly randomness: GeneratorReplay;
};
const progress = object({ hasValue: bool, value: number, max: number }),
  meter = object({
    value: number,
    min: number,
    low: number,
    high: number,
    max: number,
    optimum: number,
  }),
  mode = enumeration(["valid", "below", "above", "reversed", "indeterminate"]);
export const inputSchema = object(
  {
    progress,
    meter,
    modes: list(mode, 5),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["progress", "meter", "modes", "count"],
);
export const outputSchema = object({
  cases: list(
    object({
      mode,
      progress,
      meter,
      progressResult: progressValueMaxPercentOutputSchema,
      meterResult: nullable(meterOptimumLowHighBandClassifierOutputSchema),
      meterError: nullable(object({ field: text, code: text })),
      html: markup,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateProgressMeterBoundaryFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.modes, "modes");
    if (!(
      input.meter.min <= input.meter.low &&
      input.meter.low <= input.meter.high &&
      input.meter.high <= input.meter.max
    ))
      return simpleError(
        "meter",
        "Baseline normalized meter bounds must be ordered.",
        "invalid_bounds",
      );
    if (input.modes.includes("reversed") && input.meter.min === input.meter.max)
      return simpleError(
        "meter",
        "A nonzero baseline range is required for a reversed control.",
        "unconstructible_boundary",
      );
    // Preflight only requested mutations; valid finite extremes remain supported.
    const below = input.modes.includes("below")
        ? finite(
            input.meter.min - Math.max(1, Math.abs(input.meter.min)),
            "meter",
          )
        : 0,
      above = input.modes.includes("above")
        ? finite(
            input.meter.max + Math.max(1, Math.abs(input.meter.max)),
            "meter",
          )
        : 0;
    const progressAbove = input.modes.includes("above")
      ? finite(Math.max(1, input.progress.max) * 2, "progress")
      : 0;
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const mode = choose(input.modes, random),
          progress = {
            hasValue: input.progress.hasValue,
            value: finite(input.progress.value, "progress"),
            max: finite(input.progress.max, "progress"),
          },
          meter = {
            value: finite(input.meter.value, "meter"),
            min: finite(input.meter.min, "meter"),
            low: finite(input.meter.low, "meter"),
            high: finite(input.meter.high, "meter"),
            max: finite(input.meter.max, "meter"),
            optimum: finite(input.meter.optimum, "meter"),
          };
        if (mode === "below") {
          progress.value = -1;
          meter.value = below;
        }
        if (mode === "above") {
          progress.value = progressAbove;
          meter.value = above;
        }
        if (mode === "reversed") {
          meter.low = meter.max;
          meter.high = meter.min;
        }
        if (mode === "indeterminate") progress.hasValue = false;
        const p = calculateProgressValueMaxPercent(progress),
          m = calculateMeterOptimumLowHighBandClassifier(meter);
        if (!p.ok) throw new Error("Finite progress evidence rejected");
        let meterResult: MeterOptimumLowHighBandClassifierOutput | null = null,
          meterError: { field: string; code: string } | null = null;
        if (m.ok) meterResult = m.output;
        else {
          const issue = m.error.issues[0];
          if (mode !== "reversed" || issue?.code !== "invalid_bounds")
            throw new Error("Unexpected meter failure");
          meterError = { field: issue.field, code: issue.code };
        }
        const html =
          "<progress" +
          (progress.hasValue ? ' value="' + progress.value + '"' : "") +
          ' max="' +
          progress.max +
          '"></progress><meter value="' +
          meter.value +
          '" min="' +
          meter.min +
          '" low="' +
          meter.low +
          '" high="' +
          meter.high +
          '" max="' +
          meter.max +
          '" optimum="' +
          meter.optimum +
          '"></meter>';
        return {
          mode,
          progress,
          meter,
          progressResult: p.output,
          meterResult,
          meterError,
          html,
        };
      });
    return toolSuccess(
      finish({ cases, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const progressMeterBoundaryFixtureExample = {
  input: {
    progress: { hasValue: true, value: 3, max: 8 },
    meter: { value: 90, min: 0, low: 20, high: 80, max: 100, optimum: 10 },
    modes: ["valid", "below", "above", "reversed", "indeterminate"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        mode: "reversed",
        progress: { hasValue: true, value: 3, max: 8 },
        meter: { value: 90, min: 0, low: 100, high: 0, max: 100, optimum: 10 },
        progressResult: {
          indeterminate: false,
          effectiveMax: 8,
          effectiveValue: 3,
          percent: 37.5,
        },
        meterResult: null,
        meterError: { field: "low", code: "invalid_bounds" },
        html: '<progress value="3" max="8"></progress><meter value="90" min="0" low="100" high="0" max="100" optimum="10"></meter>',
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const progressMeterBoundaryFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/progress-meter-boundary-fixture",
  title: "Random Progress and Meter Boundary Fixture Generator",
  description:
    "Construct supported progress/meter attribute boundaries and labeled reversed/indeterminate controls, retaining actual core values or expected normalized-bound errors without real process monitoring.",
  inputSchema,
  outputSchema,
  execute: calculateProgressMeterBoundaryFixture,
});
export const runProgressMeterBoundaryFixture =
  progressMeterBoundaryFixtureTool.execute;
export default progressMeterBoundaryFixtureTool;
