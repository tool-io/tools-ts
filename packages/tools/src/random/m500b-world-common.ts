import type {
  ToolExecutionContext,
  ToolJsonSchema,
} from "../core/definition.js";
import { matchesToolJsonSchema } from "../core/contract.js";
import {
  matchesModelInput,
  modelInputIssues,
} from "../core/model-definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../core/result.js";
import { simpleError } from "../core/simple.js";
import { calculateConnectedComponents } from "../graph/connected-components/tool.js";
import { calculateBreadthFirstTraversal } from "../graph/breadth-first-traversal/tool.js";
import {
  createGeneratorRandom,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  generatorFailure,
  type GeneratorRandom,
  type GeneratorReplay,
} from "./generator-random.js";
export type WSeed = { readonly seed?: number };
export type WMeta = {
  readonly fictional: true;
  readonly randomness: GeneratorReplay;
};
export type WLink = { readonly from: string; readonly to: string };
export const wId = {
  type: "string",
  minLength: 1,
  maxLength: 64,
  pattern: "^[A-Za-z0-9][A-Za-z0-9_-]*(?![\\s\\S])",
} as const;
export const wText = { type: "string", maxLength: 1024 } as const;
export const wBool = { type: "boolean" } as const;
export const wInt = (
  minimum = 0,
  maximum = Number.MAX_SAFE_INTEGER,
): ToolJsonSchema => ({ type: "integer", minimum, maximum });
export const wArray = (
  items: ToolJsonSchema,
  maxItems = 64,
  minItems = 0,
): ToolJsonSchema => ({ type: "array", items, minItems, maxItems });
export const wObject = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
  required: readonly string[] = Object.keys(properties),
): ToolJsonSchema => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
export const wInput = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
): ToolJsonSchema =>
  wObject(
    { ...properties, seed: generatorSeedSchema },
    Object.keys(properties),
  );
export const wOutput = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
): ToolJsonSchema =>
  wObject({
    ...properties,
    fictional: { type: "boolean", const: true },
    randomness: generatorReplaySchema,
  });
export const wLinkSchema = wObject({ from: wId, to: wId });
export const wIds = wArray(wId, 16, 1);
export { matchesModelInput, simpleError };
export const wUnique = <T>(xs: readonly T[], field: string): void => {
  if (new Set(xs).size !== xs.length)
    simpleError(field, "Values must be distinct.", "duplicate_identity");
};
export const wRef = (
  id: string,
  ids: readonly string[],
  field: string,
): void => {
  if (!ids.includes(id))
    simpleError(field, "A referenced ID is not declared.", "unknown_reference");
};
export const wRefs = (
  refs: readonly string[],
  ids: readonly string[],
  field: string,
): void => {
  wUnique(refs, field);
  for (const id of refs) wRef(id, ids, field);
};
export const wKey = (edge: WLink, directed = false): string =>
  directed || edge.from < edge.to
    ? edge.from + "|" + edge.to
    : edge.to + "|" + edge.from;
export const wLinks = (
  ids: readonly string[],
  edges: readonly WLink[],
  field: string,
  directed = false,
): void => {
  for (const e of edges) {
    wRef(e.from, ids, field);
    wRef(e.to, ids, field);
    if (e.from === e.to)
      simpleError(field, "Self links are not supported.", "self_link");
  }
  wUnique(
    edges.map((e) => wKey(e, directed)),
    field,
  );
};
export const wGraph = (
  ids: readonly string[],
  edges: readonly WLink[],
  directed = false,
): Record<string, unknown> =>
  Object.fromEntries(
    ids.map((id) => [
      id,
      edges.flatMap((e) =>
        e.from === id ? [e.to] : !directed && e.to === id ? [e.from] : [],
      ),
    ]),
  );
export const wComponents = (
  ids: readonly string[],
  edges: readonly WLink[],
): number =>
  ids.length
    ? calculateConnectedComponents({ graph: wGraph(ids, edges) }).table
        .componentCount
    : 0;
export const wReach = (
  ids: readonly string[],
  edges: readonly WLink[],
  start: string,
  directed = false,
): readonly string[] =>
  calculateBreadthFirstTraversal({ graph: wGraph(ids, edges, directed), start })
    .visitOrder;
export const wBudget = (): (() => void) => {
  let states = 0;
  return () => {
    if (++states > 20000)
      simpleError(
        "constraints",
        "Search budget exhausted; feasibility is unknown.",
        "search_limit_exceeded",
      );
  };
};
export const wInfeasible = (field = "constraints"): never =>
  simpleError(
    field,
    "No construction satisfies the supplied constraints.",
    "infeasible_constraints",
  );
/** Random-priority spanning tree plus augmentation; not uniform over connected graphs. */
export const wConnected = (
  ids: readonly string[],
  candidates: readonly WLink[],
  count: number,
  random: GeneratorRandom,
): WLink[] => {
  if (
    count < ids.length - 1 ||
    count > candidates.length ||
    wComponents(ids, candidates) !== 1
  )
    return wInfeasible("edgeCount");
  const selected: WLink[] = [];
  for (const edge of random.shuffle(candidates)) {
    if (wComponents(ids, [...selected, edge]) < wComponents(ids, selected))
      selected.push(edge);
  }
  const remaining = candidates.filter((e) => !selected.includes(e));
  while (selected.length < count) {
    const chosen = random.pick(remaining);
    selected.push(chosen);
    remaining.splice(remaining.indexOf(chosen), 1);
  }
  return candidates.filter((e) => selected.includes(e)).map((e) => ({ ...e }));
};
export const wRun = <I extends WSeed, O extends object>(
  input: unknown,
  schema: ToolJsonSchema,
  guard: (v: unknown) => v is I,
  outputSchema: ToolJsonSchema,
  context: ToolExecutionContext | undefined,
  generate: (x: I, random: GeneratorRandom) => O,
): ToolResult<O & WMeta> => {
  if (!guard(input)) return invalidInput(modelInputIssues(input, schema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const output = {
      ...generate(input, random),
      fictional: true as const,
      randomness: generatorReplay(input.seed, context),
    };
    if (JSON.stringify(output).length > 1048576)
      simpleError(
        "output",
        "Output exceeds one MiB of JSON characters.",
        "resource_limit_exceeded",
      );
    if (!matchesToolJsonSchema(output, outputSchema))
      throw new Error("World generator violated its output contract.");
    return toolSuccess(output);
  } catch (error) {
    return generatorFailure(error);
  }
};
