import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markerIds: readonly string[];
  readonly channelIds: readonly string[];
};
export type Output = { readonly collidingChannels: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markerIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    channelIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["markerIds", "channelIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { collidingChannels: { type: "integer" } },
  required: ["collidingChannels"],
} as const;
/** Count supplied channel labels assigned to multiple distinct marker IDs without instrument compatibility claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markerIds, channelIds } = request;
  const compute = (): Output => {
    H.sameLength(markerIds, channelIds);
    const groups = new Map<string, Set<string>>();
    for (let i = 0; i < markerIds.length; i++) {
      const a = groups.get(channelIds[i]) ?? new Set<string>();
      a.add(markerIds[i]);
      groups.set(channelIds[i], a);
    }
    return {
      collidingChannels: [...groups.values()].filter((x) => x.size > 1).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { markerIds: ["m1", "m2", "m1"], channelIds: ["c1", "c1", "c1"] },
  output: { collidingChannels: 1 },
} satisfies ToolExample<Input, Output>;
export const immuneMarkerChannelCollisionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/immune-marker-channel-collision-count",
    title: "Immune Marker Channel Collision Count Tool",
    description:
      "Count supplied channel labels assigned to multiple distinct marker IDs without instrument compatibility claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markerIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        channelIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["markerIds", "channelIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { collidingChannels: { type: "integer" } },
      required: ["collidingChannels"],
    },
    ports: {
      inputs: [
        {
          id: "markerIds",
          label: "Marker Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "channelIds",
          label: "Channel Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "collidingChannels",
          label: "Colliding Channels",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = immuneMarkerChannelCollisionCountTool.execute;
export default immuneMarkerChannelCollisionCountTool;
