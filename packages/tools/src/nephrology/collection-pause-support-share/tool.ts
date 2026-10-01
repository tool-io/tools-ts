import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionDurations: readonly number[];
  readonly pauseDurations: readonly number[];
  readonly complete: readonly boolean[];
};
export type Output = {
  readonly grossDuration: number;
  readonly activeDuration: number;
  readonly supportedActiveDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    pauseDurations: { type: "array", maxItems: 256, items: { type: "number" } },
    complete: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["collectionDurations", "pauseDurations", "complete"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossDuration: { type: "number" },
    activeDuration: { type: "number" },
    supportedActiveDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "grossDuration",
    "activeDuration",
    "supportedActiveDuration",
    "share",
    "defined",
  ],
} as const;
/** Calculate collection pause support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectionDurations, pauseDurations, complete } = request;
  const compute = (): Output => {
    H.sameLength(collectionDurations, pauseDurations);
    H.sameLength(collectionDurations, complete);
    H.domain(
      collectionDurations.every(
        (x, i) => x >= 0 && pauseDurations[i] >= 0 && pauseDurations[i] <= x,
      ),
    );
    return (() => {
      const grossDuration = collectionDurations.reduce((a, b) => a + b, 0),
        activeDuration = collectionDurations.reduce(
          (s, x, i) => s + x - pauseDurations[i],
          0,
        ),
        supportedActiveDuration = collectionDurations.reduce(
          (s, x, i) => s + (complete[i] ? x - pauseDurations[i] : 0),
          0,
        );
      return {
        grossDuration,
        activeDuration,
        supportedActiveDuration,
        share:
          activeDuration > 0 ? supportedActiveDuration / activeDuration : 0,
        defined: activeDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collectionDurations: [10, 10],
    pauseDurations: [2, 2],
    complete: [true, false],
  },
  output: {
    grossDuration: 20,
    activeDuration: 16,
    supportedActiveDuration: 8,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const collectionPauseSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/collection-pause-support-share",
    title: "Collection Pause Support Share Tool",
    description:
      "Calculate collection pause support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        pauseDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        complete: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["collectionDurations", "pauseDurations", "complete"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossDuration: { type: "number" },
        activeDuration: { type: "number" },
        supportedActiveDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "grossDuration",
        "activeDuration",
        "supportedActiveDuration",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "collectionDurations",
          label: "Collection Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "pauseDurations",
          label: "Pause Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "complete",
          label: "Complete",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "grossDuration",
          label: "Gross Duration",
          valueType: { type: "number" },
        },
        {
          id: "activeDuration",
          label: "Active Duration",
          valueType: { type: "number" },
        },
        {
          id: "supportedActiveDuration",
          label: "Supported Active Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = collectionPauseSupportShareTool.execute;
export default collectionPauseSupportShareTool;
