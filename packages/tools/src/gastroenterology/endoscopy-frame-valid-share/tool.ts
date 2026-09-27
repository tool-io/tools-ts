import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameDurations: readonly number[];
  readonly regionVisible: readonly boolean[];
  readonly interpretable: readonly boolean[];
};
export type Output = {
  readonly visibleDuration: number;
  readonly interpretableDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    regionVisible: { type: "array", maxItems: 256, items: { type: "boolean" } },
    interpretable: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["frameDurations", "regionVisible", "interpretable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleDuration: { type: "number" },
    interpretableDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["visibleDuration", "interpretableDuration", "share", "defined"],
} as const;
/** Account for explicitly supplied research frame visibility and interpretability flags; no image diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frameDurations, regionVisible, interpretable } = request;
  const compute = (): Output => {
    H.sameLength(frameDurations, regionVisible);
    H.sameLength(frameDurations, interpretable);
    H.domain(frameDurations.every((x) => x >= 0));
    return (() => {
      const visibleDuration = frameDurations.reduce(
          (s, x, i) => s + (regionVisible[i] ? x : 0),
          0,
        ),
        interpretableDuration = frameDurations.reduce(
          (s, x, i) => s + (regionVisible[i] && interpretable[i] ? x : 0),
          0,
        );
      return {
        visibleDuration,
        interpretableDuration,
        share:
          visibleDuration > 0 ? interpretableDuration / visibleDuration : 0,
        defined: visibleDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    frameDurations: [2, 3, 5],
    regionVisible: [true, true, false],
    interpretable: [true, false, true],
  },
  output: {
    visibleDuration: 5,
    interpretableDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const endoscopyFrameValidShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/endoscopy-frame-valid-share",
    title: "Endoscopy Frame Valid Share Tool",
    description:
      "Account for explicitly supplied research frame visibility and interpretability flags; no image diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        regionVisible: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        interpretable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["frameDurations", "regionVisible", "interpretable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleDuration: { type: "number" },
        interpretableDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "visibleDuration",
        "interpretableDuration",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "frameDurations",
          label: "Frame Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "regionVisible",
          label: "Region Visible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "interpretable",
          label: "Interpretable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "visibleDuration",
          label: "Visible Duration",
          valueType: { type: "number" },
        },
        {
          id: "interpretableDuration",
          label: "Interpretable Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = endoscopyFrameValidShareTool.execute;
export default endoscopyFrameValidShareTool;
