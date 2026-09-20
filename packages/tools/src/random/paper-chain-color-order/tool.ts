import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  integer,
  strings,
  countsSchema,
  run,
  choices,
  budget,
  distinct,
  counts,
  simpleError,
  type AcCount,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
export type PaperChainColorOrderInput = AcSeed & {
  readonly colors: readonly string[];
  readonly linkCount: number;
  readonly maximumRun: number;
  readonly forbiddenNeighbors: readonly (readonly [string, string])[];
};
export type PaperChainColorOrderOutput = AcReplay & {
  readonly links: readonly string[];
  readonly colorCounts: readonly AcCount[];
};
export const inputSchema = inputObject({
  colors: strings,
  linkCount: integer(1, 64),
  maximumRun: integer(1, 64),
  forbiddenNeighbors: array(
    array({ type: "string", minLength: 1, maxLength: 80 }, 2, 2),
    64,
  ),
});
export const outputSchema = outputObject({
  links: array({ type: "string", minLength: 1, maxLength: 80 }, 64, 1),
  colorCounts: countsSchema,
});
const isInput = (v: unknown): v is PaperChainColorOrderInput =>
  matchesModelInput(v, inputSchema);
export const calculatePaperChainColorOrder = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<PaperChainColorOrderOutput, "randomness"> => {
      distinct(x.colors, "colors");
      if (
        x.forbiddenNeighbors.some((p) => p.some((c) => !x.colors.includes(c)))
      )
        return simpleError(
          "forbiddenNeighbors",
          "Neighbor rules must reference supplied colors.",
          "unknown_color",
        );
      const links: string[] = [],
        tick = budget();
      const search = (): boolean => {
        tick();
        if (links.length === x.linkCount) return true;
        const previous = links[links.length - 1];
        let runLength = 0;
        for (let i = links.length - 1; i >= 0 && links[i] === previous; i--)
          runLength++;
        for (const c of choices(
          x.colors.filter(
            (c) =>
              !(c === previous && runLength >= x.maximumRun) &&
              !x.forbiddenNeighbors.some(
                ([a, b]) =>
                  (a === previous && b === c) || (b === previous && a === c),
              ),
          ),
          random,
        )) {
          links.push(c);
          if (search()) return true;
          links.pop();
        }
        return false;
      };
      if (!search())
        return simpleError(
          "colors",
          "No link sequence satisfies run and neighbor constraints.",
          "infeasible_sequence",
        );
      return { links, colorCounts: counts(links, x.colors) };
    },
  );
export const paperChainColorOrderExample = {
  input: {
    colors: ["red", "blue"],
    linkCount: 3,
    maximumRun: 1,
    forbiddenNeighbors: [],
    seed: 42,
  },
  output: {
    links: ["blue", "red", "blue"],
    colorCounts: [
      { id: "red", count: 1 },
      { id: "blue", count: 2 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<PaperChainColorOrderInput, PaperChainColorOrderOutput>;
export const paperChainColorOrderTool = createModelDefinition<
  PaperChainColorOrderInput,
  PaperChainColorOrderOutput
>({
  id: "random/paper-chain-color-order",
  title: "Random Paper Chain Color Order Plan Generator",
  description:
    "Construct an exact-length caller-color link sequence under run and undirected adjacency rules with bounded cyclic-order search and per-color counts.",
  inputSchema,
  outputSchema,
  execute: calculatePaperChainColorOrder,
});
export const runPaperChainColorOrder = paperChainColorOrderTool.execute;
export default paperChainColorOrderTool;
