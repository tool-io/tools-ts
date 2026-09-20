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
export type CharacterRelationshipWebInput = FcSeed & {
  readonly characters: readonly {
    readonly id: string;
    readonly name: string;
  }[];
  readonly relationshipTypes: readonly string[];
  readonly edgeCount: number;
  readonly minimumDegree: number;
  readonly maximumDegree: number;
  readonly connected: boolean;
};
export type CharacterRelationshipWebOutput = FcReplay & {
  readonly fictional: boolean;
  readonly relationships: readonly {
    readonly from: string;
    readonly to: string;
    readonly type: string;
  }[];
  readonly degrees: readonly { readonly id: string; readonly degree: number }[];
  readonly components: number;
};
export const inputSchema = fcInput({
  characters: fcArray(fcObject({ id: fcId, name: fcText }), 12, 1),
  relationshipTypes: fcArray(fcId, 16, 1),
  edgeCount: fcInteger(0, 32),
  minimumDegree: fcInteger(0, 11),
  maximumDegree: fcInteger(0, 11),
  connected: fcBoolean,
});
export const outputSchema = fcOutput({
  fictional: { type: "boolean", const: true },
  relationships: fcArray(fcObject({ from: fcId, to: fcId, type: fcId }), 32),
  degrees: fcArray(fcObject({ id: fcId, degree: fcInteger(0, 11) }), 12, 1),
  components: fcInteger(1, 12),
});
const isInput = (v: unknown): v is CharacterRelationshipWebInput =>
  matchesModelInput(v, inputSchema);
export const calculateCharacterRelationshipWeb = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<CharacterRelationshipWebOutput, "randomness"> => {
      const ids = x.characters.map((c) => c.id);
      fcUnique(ids, "characters");
      fcUnique(x.relationshipTypes, "relationshipTypes");
      const edges = fcTopology(
        ids,
        x.edgeCount,
        x.minimumDegree,
        x.maximumDegree,
        x.connected,
        random,
      );
      return {
        fictional: true,
        relationships: edges.map(({ a, b }) => ({
          from: ids[a],
          to: ids[b],
          type: fcPick(x.relationshipTypes, random),
        })),
        ...fcGraphEvidence(ids, edges),
      };
    },
  );
export const characterRelationshipWebExample = {
  input: {
    characters: [
      { id: "ada", name: "Ada of Reedport" },
      { id: "ben", name: "Ben the Mapmaker" },
      { id: "cy", name: "Cy of North Quay" },
    ],
    relationshipTypes: ["friend", "rival"],
    edgeCount: 3,
    minimumDegree: 2,
    maximumDegree: 2,
    connected: true,
    seed: 42,
  },
  output: {
    fictional: true,
    relationships: [
      { from: "ada", to: "ben", type: "rival" },
      { from: "ada", to: "cy", type: "friend" },
      { from: "ben", to: "cy", type: "rival" },
    ],
    degrees: [
      { id: "ada", degree: 2 },
      { id: "ben", degree: 2 },
      { id: "cy", degree: 2 },
    ],
    components: 1,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  CharacterRelationshipWebInput,
  CharacterRelationshipWebOutput
>;
export const characterRelationshipWebTool = createModelDefinition<
  CharacterRelationshipWebInput,
  CharacterRelationshipWebOutput
>({
  id: "random/character-relationship-web",
  title: "Random Character Relationship Web Generator",
  description:
    "Generate a fictional symmetric relationship graph from supplied characters with exact edge count, degree bounds, and optional connectivity using bounded search.",
  inputSchema,
  outputSchema,
  execute: calculateCharacterRelationshipWeb,
});
export const runCharacterRelationshipWeb = characterRelationshipWebTool.execute;
export default characterRelationshipWebTool;
