import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  positive,
  num,
  object,
  label,
  run,
  choices,
  budget,
  distinct,
  limit,
  finite,
  simpleError,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import { area, inside, type Rect } from "../m500b-art-craft-geometry.js";
type DioramaZone = Rect & {
  readonly id: string;
  readonly attachmentTag: string;
};
export type PaperDioramaLayerPlanInput = AcSeed & {
  readonly width: number;
  readonly height: number;
  readonly silhouettes: readonly {
    readonly id: string;
    readonly width: number;
    readonly height: number;
    readonly attachmentTags: readonly string[];
  }[];
  readonly layers: readonly {
    readonly id: string;
    readonly depth: number;
    readonly zones: readonly DioramaZone[];
  }[];
};
export type PaperDioramaLayerPlanOutput = AcReplay & {
  readonly layers: readonly {
    readonly id: string;
    readonly depth: number;
    readonly area: number;
  }[];
  readonly placements: readonly (Rect & {
    readonly silhouetteId: string;
    readonly zoneId: string;
    readonly layerId: string;
    readonly depth: number;
    readonly attachmentTag: string;
    readonly area: number;
  })[];
  readonly totalSilhouetteArea: number;
};
export const inputSchema = inputObject({
  width: positive,
  height: positive,
  silhouettes: array(
    object({
      id: label,
      width: positive,
      height: positive,
      attachmentTags: array(label, 16, 1),
    }),
    16,
    1,
  ),
  layers: array(
    object({
      id: label,
      depth: num,
      zones: array(
        object({
          id: label,
          attachmentTag: label,
          x: num,
          y: num,
          width: positive,
          height: positive,
        }),
        16,
        1,
      ),
    }),
    16,
    1,
  ),
});
export const outputSchema = outputObject({
  layers: array(object({ id: label, depth: num, area: positive }), 16, 1),
  placements: array(
    object({
      silhouetteId: label,
      zoneId: label,
      layerId: label,
      depth: num,
      attachmentTag: label,
      x: num,
      y: num,
      width: positive,
      height: positive,
      area: positive,
    }),
    16,
    1,
  ),
  totalSilhouetteArea: positive,
});
const isInput = (v: unknown): v is PaperDioramaLayerPlanInput =>
  matchesModelInput(v, inputSchema);
export const calculatePaperDioramaLayerPlan = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<PaperDioramaLayerPlanOutput, "randomness"> => {
      distinct(
        x.silhouettes.map((s) => s.id),
        "silhouettes",
      );
      distinct(
        x.layers.map((l) => l.id),
        "layers",
      );
      distinct(
        x.layers.map((l) => String(l.depth)),
        "layers",
      );
      limit(
        x.layers.reduce((s, l) => s + l.zones.length, 0),
        16,
        "layers",
      );
      const layerArea = area(x.width, x.height);
      for (const l of x.layers) {
        distinct(
          l.zones.map((z) => z.id),
          "layers",
        );
        for (const z of l.zones)
          if (!inside(z, x.width, x.height))
            return simpleError(
              "layers",
              "Attachment zones must lie inside their layer sheet.",
              "outside_layer",
            );
      }
      x.silhouettes.forEach((s) => distinct(s.attachmentTags, "silhouettes"));
      const zones = [...x.layers]
          .sort((a, b) => a.depth - b.depth)
          .flatMap((l) => l.zones.map((z) => ({ l, z }))),
        used = new Set<string>(),
        placements: PaperDioramaLayerPlanOutput["placements"][number][] = [],
        tick = budget();
      const search = (i: number): boolean => {
        tick();
        if (i === zones.length) return true;
        const { l, z } = zones[i];
        for (const s of choices(
          x.silhouettes.filter(
            (s) =>
              !used.has(s.id) &&
              s.width <= z.width &&
              s.height <= z.height &&
              s.attachmentTags.includes(z.attachmentTag),
          ),
          random,
        )) {
          used.add(s.id);
          placements.push({
            silhouetteId: s.id,
            zoneId: z.id,
            layerId: l.id,
            depth: finite(l.depth),
            attachmentTag: z.attachmentTag,
            x: finite(z.x + (z.width - s.width) / 2),
            y: finite(z.y + (z.height - s.height) / 2),
            width: s.width,
            height: s.height,
            area: area(s.width, s.height),
          });
          if (search(i + 1)) return true;
          placements.pop();
          used.delete(s.id);
        }
        return false;
      };
      if (!search(0))
        return simpleError(
          "silhouettes",
          "No unique silhouette matching fills the supplied attachment zones.",
          "infeasible_layers",
        );
      return {
        layers: [...x.layers]
          .sort((a, b) => a.depth - b.depth)
          .map((l) => ({ id: l.id, depth: finite(l.depth), area: layerArea })),
        placements,
        totalSilhouetteArea: finite(placements.reduce((s, p) => s + p.area, 0)),
      };
    },
  );
export const paperDioramaLayerPlanExample = {
  input: {
    width: 4,
    height: 3,
    silhouettes: [{ id: "leaf", width: 2, height: 2, attachmentTags: ["tab"] }],
    layers: [
      {
        id: "back",
        depth: 0,
        zones: [
          {
            id: "center",
            attachmentTag: "tab",
            x: 0,
            y: 0,
            width: 4,
            height: 3,
          },
        ],
      },
    ],
    seed: 42,
  },
  output: {
    layers: [{ id: "back", depth: 0, area: 12 }],
    placements: [
      {
        silhouetteId: "leaf",
        zoneId: "center",
        layerId: "back",
        depth: 0,
        attachmentTag: "tab",
        x: 1,
        y: 0.5,
        width: 2,
        height: 2,
        area: 4,
      },
    ],
    totalSilhouetteArea: 4,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  PaperDioramaLayerPlanInput,
  PaperDioramaLayerPlanOutput
>;
export const paperDioramaLayerPlanTool = createModelDefinition<
  PaperDioramaLayerPlanInput,
  PaperDioramaLayerPlanOutput
>({
  id: "random/paper-diorama-layer-plan",
  title: "Random Paper Diorama Layer Plan Generator",
  description:
    "Match supplied silhouette boxes uniquely to compatible attachment zones on ordered depth layers with bounded search; print assembly and structural suitability remain external.",
  inputSchema,
  outputSchema,
  execute: calculatePaperDioramaLayerPlan,
});
export const runPaperDioramaLayerPlan = paperDioramaLayerPlanTool.execute;
export default paperDioramaLayerPlanTool;
