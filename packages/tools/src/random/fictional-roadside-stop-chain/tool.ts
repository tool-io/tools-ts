import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type FictionalRoadsideStopChainInput = w.WSeed & {
  readonly stopTypes: readonly {
    readonly id: string;
    readonly hooks: readonly string[];
  }[];
  readonly count: number;
  readonly minimumLegKm: number;
  readonly maximumLegKm: number;
  readonly forbidConsecutiveType: boolean;
};
export type FictionalRoadsideStopChainOutput = w.WMeta & {
  readonly stops: readonly {
    readonly id: string;
    readonly typeId: string;
    readonly hook: string;
    readonly positionKm: number;
  }[];
  readonly links: readonly w.WLink[];
  readonly totalKm: number;
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  stopTypes: w.wArray(
    w.wObject({ id: w.wId, hooks: w.wArray(w.wText, 16, 1) }),
    16,
    1,
  ),
  count: w.wInt(1, 32),
  minimumLegKm: w.wInt(0, 1000000),
  maximumLegKm: w.wInt(0, 1000000),
  forbidConsecutiveType: w.wBool,
});
export const outputSchema = w.wOutput({
  stops: w.wArray(
    w.wObject({
      id: w.wId,
      typeId: w.wId,
      hook: w.wText,
      positionKm: w.wInt(),
    }),
    32,
    1,
  ),
  links: w.wArray(w.wLinkSchema, 31),
  totalKm: w.wInt(),
  componentCount: w.wInt(1, 1),
});
const isInput = (v: unknown): v is FictionalRoadsideStopChainInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFictionalRoadsideStopChain = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FictionalRoadsideStopChainOutput, keyof w.WMeta> => {
      w.wUnique(
        x.stopTypes.map((t) => t.id),
        "stopTypes",
      );
      if (x.minimumLegKm > x.maximumLegKm) return w.wInfeasible("maximumLegKm");
      if (x.forbidConsecutiveType && x.count > 1 && x.stopTypes.length < 2)
        return w.wInfeasible("stopTypes");
      const stops: {
          id: string;
          typeId: string;
          hook: string;
          positionKm: number;
        }[] = [],
        links: w.WLink[] = [];
      let totalKm = 0;
      for (let i = 0; i < x.count; i++) {
        const previous = stops[i - 1];
        const type = random.pick(
          x.stopTypes.filter(
            (t) => !x.forbidConsecutiveType || t.id !== previous?.typeId,
          ),
        );
        const hook = random.pick(type.hooks);
        if (i > 0) totalKm += random.integer(x.minimumLegKm, x.maximumLegKm);
        const id = "stop-" + (i + 1);
        stops.push({ id, typeId: type.id, hook, positionKm: totalKm });
        if (previous) links.push({ from: previous.id, to: id });
      }
      return {
        stops,
        links,
        totalKm,
        componentCount: w.wComponents(
          stops.map((s) => s.id),
          links,
        ),
      };
    },
  );
export const fictionalRoadsideStopChainExample = {
  input: {
    stopTypes: [
      {
        id: "inn",
        hooks: ["rest"],
      },
      {
        id: "ferry",
        hooks: ["cross"],
      },
    ],
    count: 3,
    minimumLegKm: 2,
    maximumLegKm: 4,
    forbidConsecutiveType: true,
    seed: 42,
  },
  output: {
    stops: [
      {
        id: "stop-1",
        typeId: "ferry",
        hook: "cross",
        positionKm: 0,
      },
      {
        id: "stop-2",
        typeId: "inn",
        hook: "rest",
        positionKm: 2,
      },
      {
        id: "stop-3",
        typeId: "ferry",
        hook: "cross",
        positionKm: 5,
      },
    ],
    links: [
      {
        from: "stop-1",
        to: "stop-2",
      },
      {
        from: "stop-2",
        to: "stop-3",
      },
    ],
    totalKm: 5,
    componentCount: 1,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  FictionalRoadsideStopChainInput,
  FictionalRoadsideStopChainOutput
>;
export const fictionalRoadsideStopChainTool = createModelDefinition<
  FictionalRoadsideStopChainInput,
  FictionalRoadsideStopChainOutput
>({
  id: "random/fictional-roadside-stop-chain",
  title: "Random Fictional Roadside Stop Chain Generator",
  description:
    "Populate an imaginary connected stop chain with supplied type and hook labels, bounded integer travel legs, and optional adjacent-type exclusion; distances are fictional.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalRoadsideStopChain,
});
export const runFictionalRoadsideStopChain =
  fictionalRoadsideStopChainTool.execute;
export default fictionalRoadsideStopChainTool;
