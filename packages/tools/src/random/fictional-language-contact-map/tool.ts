import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type FictionalLanguageContactMapInput = w.WSeed & {
  readonly regionIds: readonly string[];
  readonly languageIds: readonly string[];
  readonly contacts: readonly w.WLink[];
  readonly minimumRegionsPerLanguage: number;
};
export type FictionalLanguageContactMapOutput = w.WMeta & {
  readonly regions: readonly {
    readonly id: string;
    readonly languageId: string;
  }[];
  readonly contacts: readonly {
    readonly from: string;
    readonly to: string;
    readonly sameLanguage: boolean;
  }[];
  readonly languageCounts: readonly {
    readonly id: string;
    readonly count: number;
  }[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  regionIds: w.wIds,
  languageIds: w.wIds,
  contacts: w.wArray(w.wLinkSchema, 64),
  minimumRegionsPerLanguage: w.wInt(0, 16),
});
export const outputSchema = w.wOutput({
  regions: w.wArray(w.wObject({ id: w.wId, languageId: w.wId }), 16, 1),
  contacts: w.wArray(
    w.wObject({ from: w.wId, to: w.wId, sameLanguage: w.wBool }),
    64,
  ),
  languageCounts: w.wArray(
    w.wObject({ id: w.wId, count: w.wInt(0, 16) }),
    16,
    1,
  ),
  componentCount: w.wInt(1, 16),
});
const isInput = (v: unknown): v is FictionalLanguageContactMapInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFictionalLanguageContactMap = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FictionalLanguageContactMapOutput, keyof w.WMeta> => {
      w.wUnique(x.regionIds, "regionIds");
      w.wUnique(x.languageIds, "languageIds");
      w.wLinks(x.regionIds, x.contacts, "contacts");
      if (
        x.languageIds.length * x.minimumRegionsPerLanguage >
        x.regionIds.length
      )
        return w.wInfeasible("minimumRegionsPerLanguage");
      const bank = x.languageIds.flatMap((id) =>
        Array.from({ length: x.minimumRegionsPerLanguage }, () => id),
      );
      while (bank.length < x.regionIds.length)
        bank.push(random.pick(x.languageIds));
      const labels = random.shuffle(bank),
        regions = x.regionIds.map((id, i) => ({ id, languageId: labels[i] })),
        lookup = new Map(regions.map((r) => [r.id, r.languageId]));
      return {
        regions,
        contacts: x.contacts.map((e) => ({
          ...e,
          sameLanguage: lookup.get(e.from) === lookup.get(e.to),
        })),
        languageCounts: x.languageIds.map((id) => ({
          id,
          count: labels.filter((l) => l === id).length,
        })),
        componentCount: w.wComponents(x.regionIds, x.contacts),
      };
    },
  );
export const fictionalLanguageContactMapExample = {
  input: {
    regionIds: ["a", "b", "c"],
    languageIds: ["cairn", "tidal"],
    contacts: [
      {
        from: "a",
        to: "b",
      },
      {
        from: "b",
        to: "c",
      },
    ],
    minimumRegionsPerLanguage: 1,
    seed: 42,
  },
  output: {
    regions: [
      {
        id: "a",
        languageId: "cairn",
      },
      {
        id: "b",
        languageId: "tidal",
      },
      {
        id: "c",
        languageId: "tidal",
      },
    ],
    contacts: [
      {
        from: "a",
        to: "b",
        sameLanguage: false,
      },
      {
        from: "b",
        to: "c",
        sameLanguage: true,
      },
    ],
    languageCounts: [
      {
        id: "cairn",
        count: 1,
      },
      {
        id: "tidal",
        count: 2,
      },
    ],
    componentCount: 1,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  FictionalLanguageContactMapInput,
  FictionalLanguageContactMapOutput
>;
export const fictionalLanguageContactMapTool = createModelDefinition<
  FictionalLanguageContactMapInput,
  FictionalLanguageContactMapOutput
>({
  id: "random/fictional-language-contact-map",
  title: "Random Fictional Language Contact Map Generator",
  description:
    "Assign supplied invented languages to regions with minimum coverage quotas, then label caller contact edges; constructed nonuniform allocation, not real sociolinguistic inference.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalLanguageContactMap,
});
export const runFictionalLanguageContactMap =
  fictionalLanguageContactMapTool.execute;
export default fictionalLanguageContactMapTool;
