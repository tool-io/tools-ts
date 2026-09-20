import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import {
  fcArray,
  fcBoolean,
  fcId,
  fcInput,
  fcInteger,
  fcObject,
  fcOutput,
  fcPick,
  fcRun,
  fcText,
  fcUnique,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
import { fcGraphEvidence, fcTopology } from "../m250-fiction-craft-graph.js";
export type FactionRelationship = "ally" | "rival" | "neutral";
export type FictionalFactionAllianceMapInput = FcSeed & {
  readonly factions: readonly { readonly id: string; readonly name: string }[];
  readonly pairCount: number;
  readonly relationshipTypes: readonly FactionRelationship[];
  readonly reciprocalPolicy: "same" | "independent";
  readonly connected: boolean;
  readonly maximumDegree: number;
};
export type FictionalFactionAllianceMapOutput = FcReplay & {
  readonly fictional: boolean;
  readonly relationships: readonly {
    readonly from: string;
    readonly to: string;
    readonly type: FactionRelationship;
  }[];
  readonly degrees: readonly { readonly id: string; readonly degree: number }[];
  readonly components: number;
};
const relation = {
  type: "string",
  enum: ["ally", "rival", "neutral"],
} as const;
export const inputSchema = fcInput({
  factions: fcArray(fcObject({ id: fcId, name: fcText }), 12, 1),
  pairCount: fcInteger(0, 32),
  relationshipTypes: fcArray(relation, 3, 1),
  reciprocalPolicy: { type: "string", enum: ["same", "independent"] },
  connected: fcBoolean,
  maximumDegree: fcInteger(0, 11),
});
export const outputSchema = fcOutput({
  fictional: { type: "boolean", const: true },
  relationships: fcArray(
    fcObject({ from: fcId, to: fcId, type: relation }),
    64,
  ),
  degrees: fcArray(fcObject({ id: fcId, degree: fcInteger(0, 11) }), 12, 1),
  components: fcInteger(1, 12),
});
const isInput = (v: unknown): v is FictionalFactionAllianceMapInput =>
  matchesModelInput(v, inputSchema);
export const calculateFictionalFactionAllianceMap = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<FictionalFactionAllianceMapOutput, "randomness"> => {
      const ids = x.factions.map((f) => f.id);
      fcUnique(ids, "factions");
      fcUnique(x.relationshipTypes, "relationshipTypes");
      const pairs = fcTopology(
        ids,
        x.pairCount,
        0,
        x.maximumDegree,
        x.connected,
        random,
      );
      const relationships = pairs.flatMap(({ a, b }) => {
        const type = fcPick(x.relationshipTypes, random);
        return [
          { from: ids[a], to: ids[b], type },
          {
            from: ids[b],
            to: ids[a],
            type:
              x.reciprocalPolicy === "same"
                ? type
                : fcPick(x.relationshipTypes, random),
          },
        ];
      });
      return { fictional: true, relationships, ...fcGraphEvidence(ids, pairs) };
    },
  );
export const fictionalFactionAllianceMapExample = {
  input: {
    factions: [
      { id: "reed", name: "Reed Council" },
      { id: "tide", name: "Tide Guild" },
    ],
    pairCount: 1,
    relationshipTypes: ["ally", "rival", "neutral"],
    reciprocalPolicy: "same",
    connected: true,
    maximumDegree: 1,
    seed: 42,
  },
  output: {
    fictional: true,
    relationships: [
      { from: "reed", to: "tide", type: "rival" },
      { from: "tide", to: "reed", type: "rival" },
    ],
    degrees: [
      { id: "reed", degree: 1 },
      { id: "tide", degree: 1 },
    ],
    components: 1,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  FictionalFactionAllianceMapInput,
  FictionalFactionAllianceMapOutput
>;
export const fictionalFactionAllianceMapTool = createModelDefinition<
  FictionalFactionAllianceMapInput,
  FictionalFactionAllianceMapOutput
>({
  id: "random/fictional-faction-alliance-map",
  title: "Random Fictional Faction Alliance Map Generator",
  description:
    "Generate supplied fictional factions' ally, rival, or neutral pair network with bounded topology search and same or independent reciprocal labels.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalFactionAllianceMap,
});
export const runFictionalFactionAllianceMap =
  fictionalFactionAllianceMapTool.execute;
export default fictionalFactionAllianceMapTool;
