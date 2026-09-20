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

export type Input = {
  readonly steps: readonly {
    readonly id: string;
    readonly label: string;
    readonly optional: boolean;
  }[];
  readonly eventCount: number;
  readonly seed?: number;
};
export type Output = {
  readonly steps: readonly {
    readonly id: string;
    readonly label: string;
    readonly optional: boolean;
  }[];
  readonly events: readonly {
    readonly action: "next" | "back" | "skip" | "resume";
    readonly from: string;
    readonly target: string;
    readonly accepted: boolean;
    readonly reason: string;
    readonly furthest: string;
  }[];
  readonly finalStep: string;
  readonly randomness: GeneratorReplay;
};
const stepSchema = object({ id, label, optional: bool });
export const inputSchema = object(
  {
    steps: list(stepSchema),
    eventCount: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["steps", "eventCount"],
);
export const outputSchema = object({
  steps: list(stepSchema),
  events: list(
    object({
      action: enumeration(["next", "back", "skip", "resume"]),
      from: id,
      target: id,
      accepted: bool,
      reason: text,
      furthest: id,
    }),
  ),
  finalStep: id,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateFormWizardStateFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(
      input.steps.map((s) => s.id),
      "steps",
    );
    work(input.eventCount, input.steps.length, "eventCount");
    const random = createGeneratorRandom(input.seed, context),
      steps = input.steps.map((s) => ({ ...s, label: preview(s.label, 128) }));
    let position = 0,
      furthest = 0;
    const events = Array.from({ length: input.eventCount }, () => {
      const action = choose(
          ["next", "back", "skip", "resume"] as const,
          random,
        ),
        from = steps[position];
      if (!from) throw new Error("Wizard state absent");
      let next = position,
        reason = "accepted";
      if (action === "resume") next = furthest;
      else if (action === "back") {
        if (position === 0) reason = "first-step";
        else next--;
      } else if (position === steps.length - 1) reason = "last-step";
      else if (action === "skip" && !from.optional) reason = "required-step";
      else next++;
      const accepted = reason === "accepted";
      if (accepted) {
        position = next;
        furthest = Math.max(furthest, position);
      }
      const target = steps[position],
        last = steps[furthest];
      if (!target || !last) throw new Error("Wizard index absent");
      return {
        action,
        from: from.id,
        target: target.id,
        accepted,
        reason,
        furthest: last.id,
      };
    });
    const final = steps[position];
    if (!final) throw new Error("Wizard final state absent");
    return toolSuccess(
      finish({
        steps,
        events,
        finalStep: final.id,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const formWizardStateFixtureExample = {
  input: {
    steps: [
      { id: "account", label: "Account", optional: false },
      { id: "review", label: "Review", optional: true },
    ],
    eventCount: 3,
    seed: 42,
  },
  output: {
    steps: [
      { id: "account", label: "Account", optional: false },
      { id: "review", label: "Review", optional: true },
    ],
    events: [
      {
        action: "skip",
        from: "account",
        target: "account",
        accepted: false,
        reason: "required-step",
        furthest: "account",
      },
      {
        action: "back",
        from: "account",
        target: "account",
        accepted: false,
        reason: "first-step",
        furthest: "account",
      },
      {
        action: "resume",
        from: "account",
        target: "account",
        accepted: true,
        reason: "accepted",
        furthest: "account",
      },
    ],
    finalStep: "account",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const formWizardStateFixtureTool = createModelDefinition<Input, Output>({
  id: "random/form-wizard-state-fixture",
  title: "Random Form Wizard State Fixture Generator",
  description:
    "Generate next, back, optional-step skip and furthest-visited resume attempts from supplied wizard steps, preserving rejected transitions under an explicit synthetic policy.",
  inputSchema,
  outputSchema,
  execute: calculateFormWizardStateFixture,
});
export const runFormWizardStateFixture = formWizardStateFixtureTool.execute;
export default formWizardStateFixtureTool;
