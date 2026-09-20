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
  calculatePureNashEquilibria,
  type PureNashEquilibrium,
} from "../../game-theory/pure-nash-equilibria/tool.js";
import { bestResponseDynamics } from "../../game-theory/best-response-dynamics/tool.js";

export type PayoffMatrixGameInput = {
  readonly rowStrategies: number;
  readonly columnStrategies: number;
  readonly minimumPayoff: number;
  readonly maximumPayoff: number;
  readonly iterations: number;
  readonly seed?: number;
};
export type PayoffMatrixGameOutput = {
  readonly rowPayoffs: readonly (readonly number[])[];
  readonly columnPayoffs: readonly (readonly number[])[];
  readonly initial: {
    readonly rowAction: number;
    readonly columnAction: number;
  };
  readonly equilibria: readonly PureNashEquilibrium[];
  readonly trace: readonly {
    readonly step: number;
    readonly rowAction: number;
    readonly columnAction: number;
    readonly isPureEquilibrium: boolean;
  }[];
  readonly summary: {
    readonly equilibriumCount: number;
    readonly firstRepeatedProfileStep: number | null;
  };
  readonly randomness: GeneratorReplay;
};
const matrixSchema = {
  type: "array",
  minItems: 1,
  maxItems: 16,
  items: {
    type: "array",
    minItems: 1,
    maxItems: 16,
    items: { type: "integer" },
  },
} as const;
const profileProperties = {
  rowAction: { type: "integer", minimum: 0, maximum: 15 },
  columnAction: { type: "integer", minimum: 0, maximum: 15 },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowStrategies: { type: "integer", minimum: 1, maximum: 16 },
    columnStrategies: { type: "integer", minimum: 1, maximum: 16 },
    minimumPayoff: { type: "integer" },
    maximumPayoff: { type: "integer" },
    iterations: { type: "integer", minimum: 1, maximum: 128 },
    seed: generatorSeedSchema,
  },
  required: [
    "rowStrategies",
    "columnStrategies",
    "minimumPayoff",
    "maximumPayoff",
    "iterations",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowPayoffs: matrixSchema,
    columnPayoffs: matrixSchema,
    initial: {
      type: "object",
      additionalProperties: false,
      properties: profileProperties,
      required: ["rowAction", "columnAction"],
    },
    equilibria: {
      type: "array",
      maxItems: 256,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          rowStrategy: { type: "integer", minimum: 0, maximum: 15 },
          columnStrategy: { type: "integer", minimum: 0, maximum: 15 },
          rowPayoff: { type: "integer" },
          columnPayoff: { type: "integer" },
        },
        required: [
          "rowStrategy",
          "columnStrategy",
          "rowPayoff",
          "columnPayoff",
        ],
      },
    },
    trace: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          ...profileProperties,
          step: { type: "integer", minimum: 1, maximum: 128 },
          isPureEquilibrium: { type: "boolean" },
        },
        required: ["rowAction", "columnAction", "step", "isPureEquilibrium"],
      },
    },
    summary: {
      type: "object",
      additionalProperties: false,
      properties: {
        equilibriumCount: { type: "integer", minimum: 0, maximum: 256 },
        firstRepeatedProfileStep: {
          anyOf: [
            { type: "integer", minimum: 1, maximum: 128 },
            { type: "null" },
          ],
        },
      },
      required: ["equilibriumCount", "firstRepeatedProfileStep"],
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "rowPayoffs",
    "columnPayoffs",
    "initial",
    "equilibria",
    "trace",
    "summary",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is PayoffMatrixGameInput =>
  matchesModelInput(input, inputSchema);
export const calculatePayoffMatrixGame = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PayoffMatrixGameOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.minimumPayoff > input.maximumPayoff)
      simpleError(
        "maximumPayoff",
        "Payoff bounds must be ordered.",
        "invalid_payoff_range",
      );
    const random = createGeneratorRandom(input.seed, context),
      draw = (): number[][] =>
        Array.from({ length: input.rowStrategies }, () =>
          Array.from({ length: input.columnStrategies }, () =>
            random.integer(input.minimumPayoff, input.maximumPayoff),
          ),
        );
    const rowPayoffs = draw(),
      columnPayoffs = draw(),
      initial = {
        rowAction: random.integer(0, input.rowStrategies - 1),
        columnAction: random.integer(0, input.columnStrategies - 1),
      };
    const equilibriumResult = calculatePureNashEquilibria(
        rowPayoffs,
        columnPayoffs,
      ),
      dynamics = bestResponseDynamics(
        rowPayoffs,
        columnPayoffs,
        initial.rowAction,
        initial.columnAction,
        input.iterations,
      );
    if (dynamics === null)
      throw new Error(
        "Generated compatible payoff matrices were rejected by the dynamics core.",
      );
    const equilibriumProfiles = new Set(
        equilibriumResult.equilibria.map(
          (point) => point.rowStrategy + "," + point.columnStrategy,
        ),
      ),
      seen = new Set([initial.rowAction + "," + initial.columnAction]);
    let firstRepeatedProfileStep: number | null = null;
    const trace = dynamics.map((step) => {
      const profile = step.rowAction + "," + step.columnAction;
      if (seen.has(profile) && firstRepeatedProfileStep === null)
        firstRepeatedProfileStep = step.step;
      seen.add(profile);
      return { ...step, isPureEquilibrium: equilibriumProfiles.has(profile) };
    });
    return toolSuccess({
      rowPayoffs,
      columnPayoffs,
      initial,
      equilibria: equilibriumResult.equilibria,
      trace,
      summary: {
        equilibriumCount: equilibriumResult.equilibriumCount,
        firstRepeatedProfileStep,
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const payoffMatrixGameExample = {
  input: {
    rowStrategies: 2,
    columnStrategies: 2,
    minimumPayoff: 0,
    maximumPayoff: 4,
    iterations: 3,
    seed: 42,
  },
  output: {
    rowPayoffs: [
      [3, 2],
      [4, 3],
    ],
    columnPayoffs: [
      [0, 2],
      [1, 3],
    ],
    initial: {
      rowAction: 1,
      columnAction: 0,
    },
    equilibria: [
      {
        columnPayoff: 3,
        columnStrategy: 1,
        rowPayoff: 3,
        rowStrategy: 1,
      },
    ],
    trace: [
      {
        columnAction: 1,
        rowAction: 1,
        step: 1,
        isPureEquilibrium: true,
      },
      {
        columnAction: 1,
        rowAction: 1,
        step: 2,
        isPureEquilibrium: true,
      },
      {
        columnAction: 1,
        rowAction: 1,
        step: 3,
        isPureEquilibrium: true,
      },
    ],
    summary: {
      equilibriumCount: 1,
      firstRepeatedProfileStep: 2,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<PayoffMatrixGameInput, PayoffMatrixGameOutput>;
export const payoffMatrixGameTool = createModelDefinition<
  PayoffMatrixGameInput,
  PayoffMatrixGameOutput
>({
  id: "random/payoff-matrix-game",
  title: "Random Payoff Matrix Game Generator",
  description:
    "Generate bounded two-player integer payoff matrices and a random initial profile, delegate all pure Nash equilibria and fixed-count row-then-column best responses with lowest-index tie breaking, and annotate repeated profiles; no mixed-equilibrium solver or convergence guarantee.",
  inputSchema,
  outputSchema,
  execute: calculatePayoffMatrixGame,
});
export const runPayoffMatrixGame = payoffMatrixGameTool.execute;
export default payoffMatrixGameTool;
