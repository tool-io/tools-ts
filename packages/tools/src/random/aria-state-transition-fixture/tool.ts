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
  calculateAriaStateAttributePairChecker,
  ariaStateAttributePairCheckerOutputSchema,
  type AriaStateAttributePairCheckerOutput,
} from "../../html/aria-state-attribute-pair-checker/tool.js";

export type Input = {
  readonly role: string;
  readonly attribute: string;
  readonly values: readonly string[];
  readonly transitions: readonly {
    readonly from: string;
    readonly to: string;
  }[];
  readonly initialValue: string;
  readonly eventCount: number;
  readonly seed?: number;
};
export type Output = {
  readonly events: readonly {
    readonly from: string;
    readonly attempted: string;
    readonly value: string;
    readonly accepted: boolean;
    readonly html: string;
    readonly lexical: AriaStateAttributePairCheckerOutput;
  }[];
  readonly finalValue: string;
  readonly randomness: GeneratorReplay;
};
const token = { type: "string", minLength: 1, maxLength: 100 } as const;
export const inputSchema = object(
  {
    role: label,
    attribute: token,
    values: list(token, 16),
    transitions: list(object({ from: token, to: token }), 32, 0),
    initialValue: token,
    eventCount: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["role", "attribute", "values", "transitions", "initialValue", "eventCount"],
);
export const outputSchema = object({
  events: list(
    object({
      from: token,
      attempted: token,
      value: token,
      accepted: bool,
      html: markup,
      lexical: ariaStateAttributePairCheckerOutputSchema,
    }),
  ),
  finalValue: token,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateAriaStateTransitionFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.values, "values");
    if (
      !input.values.includes(input.initialValue) ||
      input.transitions.some(
        (t) => !input.values.includes(t.from) || !input.values.includes(t.to),
      )
    )
      return simpleError(
        "transitions",
        "Initial state and edges must refer to supplied values.",
        "invalid_state_reference",
      );
    for (const value of input.values) {
      const core = calculateAriaStateAttributePairChecker({
        attribute: input.attribute,
        value,
      });
      if (!core.ok) throw new Error("Bounded state token rejected");
      if (!core.output.knownState || !core.output.definedValue)
        return simpleError(
          "values",
          "Every value must be a defined lexical token for this state attribute.",
          "unsupported_state_token",
        );
    }
    const random = createGeneratorRandom(input.seed, context);
    let value = input.initialValue;
    const events = Array.from({ length: input.eventCount }, () => {
      const from = value,
        attempted = choose(input.values, random),
        accepted = input.transitions.some(
          (t) => t.from === from && t.to === attempted,
        );
      if (accepted) value = attempted;
      const core = calculateAriaStateAttributePairChecker({
        attribute: input.attribute,
        value,
      });
      if (!core.ok) throw new Error("Constructed state rejected");
      return {
        from,
        attempted,
        value,
        accepted,
        html:
          '<div role="' +
          escape(input.role) +
          '" ' +
          input.attribute +
          '="' +
          escape(value) +
          '"></div>',
        lexical: core.output,
      };
    });
    return toolSuccess(
      finish({
        events,
        finalValue: value,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const ariaStateTransitionFixtureExample = {
  input: {
    role: "button",
    attribute: "aria-expanded",
    values: ["false", "true"],
    transitions: [{ from: "false", to: "true" }],
    initialValue: "false",
    eventCount: 2,
    seed: 42,
  },
  output: {
    events: [
      {
        from: "false",
        attempted: "true",
        value: "true",
        accepted: true,
        html: '<div role="button" aria-expanded="true"></div>',
        lexical: { knownState: true, definedValue: true },
      },
      {
        from: "true",
        attempted: "false",
        value: "true",
        accepted: false,
        html: '<div role="button" aria-expanded="true"></div>',
        lexical: { knownState: true, definedValue: true },
      },
    ],
    finalValue: "true",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const ariaStateTransitionFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/aria-state-transition-fixture",
  title: "Random ARIA State Transition Fixture Generator",
  description:
    "Generate role/state snapshots and attempted transitions under caller-reviewed consistency edges, checking state tokens lexically without certifying role applicability or accessibility.",
  inputSchema,
  outputSchema,
  execute: calculateAriaStateTransitionFixture,
});
export const runAriaStateTransitionFixture =
  ariaStateTransitionFixtureTool.execute;
export default ariaStateTransitionFixtureTool;
