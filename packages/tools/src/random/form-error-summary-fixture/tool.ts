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
  calculateLabelForIdBindingChecker,
  labelForIdBindingCheckerOutputSchema,
  type LabelForIdBindingCheckerOutput,
} from "../../html/label-for-id-binding-checker/tool.js";

export type Input = {
  readonly errors: readonly {
    readonly id: string;
    readonly label: string;
    readonly message: string;
  }[];
  readonly selectedCount: number;
  readonly mode: "consistent" | "omit" | "wrong-target";
  readonly seed?: number;
};
export type Output = {
  readonly errors: readonly {
    readonly id: string;
    readonly label: string;
    readonly message: string;
    readonly binding: LabelForIdBindingCheckerOutput;
  }[];
  readonly links: readonly {
    readonly fieldId: string;
    readonly target: string;
    readonly message: string;
  }[];
  readonly missingSummaryIds: readonly string[];
  readonly brokenLinkIds: readonly string[];
  readonly html: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    errors: list(object({ id, label, message: label }), 16),
    selectedCount: integer(1, 16),
    mode: enumeration(["consistent", "omit", "wrong-target"]),
    seed: generatorSeedSchema,
  },
  ["errors", "selectedCount", "mode"],
);
export const outputSchema = object({
  errors: list(
    object({
      id,
      label,
      message: label,
      binding: labelForIdBindingCheckerOutputSchema,
    }),
    16,
  ),
  links: list(object({ fieldId: id, target: text, message: label }), 16, 0),
  missingSummaryIds: list(id, 16, 0),
  brokenLinkIds: list(id, 16, 0),
  html: markup,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateFormErrorSummaryFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(
      input.errors.map((e) => e.id),
      "errors",
    );
    if (input.selectedCount > input.errors.length)
      return simpleError(
        "selectedCount",
        "Cannot select more errors than supplied.",
        "infeasible_error_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      pool = [...input.errors],
      selected: Input["errors"][number][] = [];
    for (let i = 0; i < input.selectedCount; i++) {
      const error = choose(pool, random);
      selected.push(error);
      pool.splice(
        pool.findIndex((e) => e.id === error.id),
        1,
      );
    }
    const ids = selected.map((e) => e.id),
      errors = selected.map((e) => {
        const core = calculateLabelForIdBindingChecker({
          hasFor: true,
          forId: e.id,
          elementIds: ids,
          labelable: ids.map(() => true),
          implicitLabelableCount: 0,
        });
        if (!core.ok) throw new Error("Error label evidence rejected");
        return { ...e, binding: core.output };
      }),
      links = selected.flatMap((e, i) =>
        input.mode === "omit" && i === 0
          ? []
          : [
              {
                fieldId: e.id,
                target:
                  input.mode === "wrong-target" && i === 0
                    ? "missing-" + e.id
                    : e.id,
                message: e.message,
              },
            ],
      ),
      missingSummaryIds = ids.filter(
        (id) => !links.some((l) => l.target === id),
      ),
      brokenLinkIds = links
        .filter((l) => !ids.includes(l.target))
        .map((l) => l.fieldId),
      html =
        "<div><ul>" +
        links
          .map(
            (l) =>
              '<li><a href="#' +
              escape(l.target) +
              '">' +
              escape(l.message) +
              "</a></li>",
          )
          .join("") +
        "</ul>" +
        selected
          .map(
            (e) =>
              '<label for="' +
              e.id +
              '">' +
              escape(e.label) +
              '</label><input id="' +
              e.id +
              '" aria-invalid="true"><p>' +
              escape(e.message) +
              "</p>",
          )
          .join("") +
        "</div>";
    return toolSuccess(
      finish({
        errors,
        links,
        missingSummaryIds,
        brokenLinkIds,
        html,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const formErrorSummaryFixtureExample = {
  input: {
    errors: [
      { id: "name", label: "Name", message: "Enter a name" },
      { id: "email", label: "Email", message: "Enter an email" },
    ],
    selectedCount: 2,
    mode: "omit",
    seed: 42,
  },
  output: {
    errors: [
      {
        id: "email",
        label: "Email",
        message: "Enter an email",
        binding: { bound: true, targetIndex: 0, duplicateId: false },
      },
      {
        id: "name",
        label: "Name",
        message: "Enter a name",
        binding: { bound: true, targetIndex: 1, duplicateId: false },
      },
    ],
    links: [{ fieldId: "name", target: "name", message: "Enter a name" }],
    missingSummaryIds: ["email"],
    brokenLinkIds: [],
    html: '<div><ul><li><a href="#name">Enter a name</a></li></ul><label for="email">Email</label><input id="email" aria-invalid="true"><p>Enter an email</p><label for="name">Name</label><input id="name" aria-invalid="true"><p>Enter a name</p></div>',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const formErrorSummaryFixtureTool = createModelDefinition<Input, Output>(
  {
    id: "random/form-error-summary-fixture",
    title: "Random Form Error Summary Fixture Generator",
    description:
      "Construct caller field errors and summary links with omit/wrong-target controls, retaining independent label-binding checks and deterministic missing/broken-link answer keys.",
    inputSchema,
    outputSchema,
    execute: calculateFormErrorSummaryFixture,
  },
);
export const runFormErrorSummaryFixture = formErrorSummaryFixtureTool.execute;
export default formErrorSummaryFixtureTool;
