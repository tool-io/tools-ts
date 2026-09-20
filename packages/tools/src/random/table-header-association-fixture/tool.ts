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
  calculateTableThScopeA11yChecker,
  tableThScopeA11yCheckerOutputSchema,
  type TableThScopeA11yCheckerOutput,
} from "../../html/table-th-scope-a11y-checker/tool.js";

export type Input = {
  readonly headers: readonly {
    readonly label: string;
    readonly scope: string;
  }[];
  readonly rows: readonly (readonly string[])[];
  readonly modes: readonly ("unchanged" | "row" | "missing" | "invalid")[];
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly cases: readonly {
    readonly mutatedColumn: number;
    readonly mode: "unchanged" | "row" | "missing" | "invalid";
    readonly html: string;
    readonly headers: readonly {
      readonly id: string;
      readonly scope: string | null;
      readonly check: TableThScopeA11yCheckerOutput;
      readonly matchesColumnDesign: boolean;
    }[];
    readonly cells: readonly {
      readonly row: number;
      readonly column: number;
      readonly text: string;
      readonly expectedHeaderId: string;
      readonly modeledHeaderId: string | null;
    }[];
  }[];
  readonly randomness: GeneratorReplay;
};
const mode = enumeration(["unchanged", "row", "missing", "invalid"]);
export const inputSchema = object(
  {
    headers: list(object({ label, scope: text }), 16),
    rows: list(list(text, 16), 16),
    modes: list(mode, 4),
    count: integer(1, 16),
    seed: generatorSeedSchema,
  },
  ["headers", "rows", "modes", "count"],
);
export const outputSchema = object({
  cases: list(
    object({
      mutatedColumn: integer(0, 15),
      mode,
      html: markup,
      headers: list(
        object({
          id,
          scope: nullable(text),
          check: tableThScopeA11yCheckerOutputSchema,
          matchesColumnDesign: bool,
        }),
        16,
      ),
      cells: list(
        object({
          row: integer(0, 15),
          column: integer(0, 15),
          text,
          expectedHeaderId: id,
          modeledHeaderId: nullable(id),
        }),
        128,
      ),
    }),
    16,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateTableHeaderAssociationFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.modes, "modes");
    if (input.rows.some((r) => r.length !== input.headers.length))
      return simpleError(
        "rows",
        "Every row must match the header width.",
        "ragged_table",
      );
    work(
      input.count,
      input.headers.length * (input.rows.length + 1),
      "count",
      128,
    );
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const mutatedColumn = choose(
            input.headers.map((_, i) => i),
            random,
          ),
          mode = choose(input.modes, random),
          headers = input.headers.map((h, i) => {
            const scope =
                i !== mutatedColumn || mode === "unchanged"
                  ? h.scope
                  : mode === "row"
                    ? "row"
                    : mode === "missing"
                      ? null
                      : "invalid",
              core = calculateTableThScopeA11yChecker({
                present: scope !== null,
                value: scope ?? "",
              });
            if (!core.ok) throw new Error("Constructed scope rejected");
            return {
              id: "header-" + i,
              scope,
              check: core.output,
              matchesColumnDesign:
                core.output.state === "col" && core.output.validKeyword,
            };
          }),
          cells = input.rows.flatMap((row, r) =>
            row.map((text, c) => {
              const header = headers[c];
              if (!header) throw new Error("Header absent");
              return {
                row: r,
                column: c,
                text,
                expectedHeaderId: header.id,
                modeledHeaderId: header.matchesColumnDesign ? header.id : null,
              };
            }),
          ),
          html =
            "<table><thead><tr>" +
            headers
              .map(
                (h, i) =>
                  '<th id="' +
                  h.id +
                  '"' +
                  (h.scope === null ? "" : ' scope="' + escape(h.scope) + '"') +
                  ">" +
                  escape(input.headers[i]?.label ?? "") +
                  "</th>",
              )
              .join("") +
            "</tr></thead><tbody>" +
            input.rows
              .map(
                (row) =>
                  "<tr>" +
                  row.map((t) => "<td>" + escape(t) + "</td>").join("") +
                  "</tr>",
              )
              .join("") +
            "</tbody></table>";
        return { mutatedColumn, mode, html, headers, cells };
      });
    return toolSuccess(
      finish({ cases, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const tableHeaderAssociationFixtureExample = {
  input: {
    headers: [
      { label: "Name", scope: "col" },
      { label: "Count", scope: "col" },
    ],
    rows: [["A", "2"]],
    modes: ["unchanged", "row", "missing", "invalid"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        mutatedColumn: 1,
        mode: "row",
        html: '<table><thead><tr><th id="header-0" scope="col">Name</th><th id="header-1" scope="row">Count</th></tr></thead><tbody><tr><td>A</td><td>2</td></tr></tbody></table>',
        headers: [
          {
            id: "header-0",
            scope: "col",
            check: { state: "col", validKeyword: true },
            matchesColumnDesign: true,
          },
          {
            id: "header-1",
            scope: "row",
            check: { state: "row", validKeyword: true },
            matchesColumnDesign: false,
          },
        ],
        cells: [
          {
            row: 0,
            column: 0,
            text: "A",
            expectedHeaderId: "header-0",
            modeledHeaderId: "header-0",
          },
          {
            row: 0,
            column: 1,
            text: "2",
            expectedHeaderId: "header-1",
            modeledHeaderId: null,
          },
        ],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const tableHeaderAssociationFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/table-header-association-fixture",
  title: "Random Table Header Association Fixture Generator",
  description:
    "Construct bounded caller data tables with controlled column-scope mutations, reporting lexical th-scope checks separately from a designed simple column-header association key.",
  inputSchema,
  outputSchema,
  execute: calculateTableHeaderAssociationFixture,
});
export const runTableHeaderAssociationFixture =
  tableHeaderAssociationFixtureTool.execute;
export default tableHeaderAssociationFixtureTool;
