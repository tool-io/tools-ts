import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";
import { generatorSampleIndices } from "../generator-random.js";
import { snTemplate } from "../m250-sampling-narrative-support.js";
export type FantasyBorderCheckpointPlanInput = w.WSeed & {
  readonly regions: readonly {
    readonly id: string;
    readonly realmId: string;
  }[];
  readonly links: readonly w.WLink[];
  readonly checkpointCount: number;
  readonly permissionTemplates: readonly {
    readonly id: string;
    readonly text: string;
  }[];
};
export type FantasyBorderCheckpointPlanOutput = w.WMeta & {
  readonly checkpoints: readonly {
    readonly id: string;
    readonly from: string;
    readonly to: string;
    readonly fromRealm: string;
    readonly toRealm: string;
    readonly templateId: string;
    readonly permission: string;
  }[];
  readonly ordinaryLinks: readonly w.WLink[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  regions: w.wArray(w.wObject({ id: w.wId, realmId: w.wId }), 16, 1),
  links: w.wArray(w.wLinkSchema, 64),
  checkpointCount: w.wInt(0, 64),
  permissionTemplates: w.wArray(w.wObject({ id: w.wId, text: w.wText }), 16, 1),
});
export const outputSchema = w.wOutput({
  checkpoints: w.wArray(
    w.wObject({
      id: w.wId,
      from: w.wId,
      to: w.wId,
      fromRealm: w.wId,
      toRealm: w.wId,
      templateId: w.wId,
      permission: { type: "string", maxLength: 131072 },
    }),
    64,
  ),
  ordinaryLinks: w.wArray(w.wLinkSchema, 64),
  componentCount: w.wInt(1, 16),
});
const isInput = (v: unknown): v is FantasyBorderCheckpointPlanInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFantasyBorderCheckpointPlan = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FantasyBorderCheckpointPlanOutput, keyof w.WMeta> => {
      const ids = x.regions.map((r) => r.id);
      w.wUnique(ids, "regions");
      w.wLinks(ids, x.links, "links");
      w.wUnique(
        x.permissionTemplates.map((t) => t.id),
        "permissionTemplates",
      );
      for (const t of x.permissionTemplates)
        snTemplate(
          t.text,
          { fromRealm: "", toRealm: "" },
          "permissionTemplates",
        );
      const realms = new Map(x.regions.map((r) => [r.id, r.realmId])),
        eligible = x.links.filter(
          (e) => realms.get(e.from) !== realms.get(e.to),
        );
      if (x.checkpointCount > eligible.length)
        return w.wInfeasible("checkpointCount");
      const chosen = generatorSampleIndices(
        eligible.length,
        x.checkpointCount,
        random,
      ).map((i) => eligible[i]);
      const checkpoints = chosen.map((e, i) => {
        const template = random.pick(x.permissionTemplates),
          fromRealm = realms.get(e.from) ?? "",
          toRealm = realms.get(e.to) ?? "";
        return {
          id: "checkpoint-" + (i + 1),
          ...e,
          fromRealm,
          toRealm,
          templateId: template.id,
          permission: snTemplate(
            template.text,
            { fromRealm, toRealm },
            "permissionTemplates",
          ),
        };
      });
      return {
        checkpoints,
        ordinaryLinks: x.links
          .filter((e) => !chosen.includes(e))
          .map((e) => ({ ...e })),
        componentCount: w.wComponents(ids, x.links),
      };
    },
  );
export const fantasyBorderCheckpointPlanExample = {
  input: {
    regions: [
      {
        id: "a",
        realmId: "north",
      },
      {
        id: "b",
        realmId: "south",
      },
      {
        id: "c",
        realmId: "south",
      },
    ],
    links: [
      {
        from: "a",
        to: "b",
      },
      {
        from: "b",
        to: "c",
      },
    ],
    checkpointCount: 1,
    permissionTemplates: [
      {
        id: "pass",
        text: "Pass {fromRealm} to {toRealm}",
      },
    ],
    seed: 42,
  },
  output: {
    checkpoints: [
      {
        id: "checkpoint-1",
        from: "a",
        to: "b",
        fromRealm: "north",
        toRealm: "south",
        templateId: "pass",
        permission: "Pass north to south",
      },
    ],
    ordinaryLinks: [
      {
        from: "b",
        to: "c",
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
  FantasyBorderCheckpointPlanInput,
  FantasyBorderCheckpointPlanOutput
>;
export const fantasyBorderCheckpointPlanTool = createModelDefinition<
  FantasyBorderCheckpointPlanInput,
  FantasyBorderCheckpointPlanOutput
>({
  id: "random/fantasy-border-checkpoint-plan",
  title: "Random Fantasy Border Checkpoint Plan Generator",
  description:
    "Place fictional checkpoints on cross-realm caller links and expand supplied permission templates; exact sampling without replacement, not immigration or enforcement advice.",
  inputSchema,
  outputSchema,
  execute: calculateFantasyBorderCheckpointPlan,
});
export const runFantasyBorderCheckpointPlan =
  fantasyBorderCheckpointPlanTool.execute;
export default fantasyBorderCheckpointPlanTool;
