import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly planterVolume: number;
  readonly rootballVolume: number;
  readonly drainageVolume: number;
  readonly sharedVolume: number;
};
export type Output = { readonly freeVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    planterVolume: { type: "number", minimum: 0 },
    rootballVolume: { type: "number", minimum: 0 },
    drainageVolume: { type: "number", minimum: 0 },
    sharedVolume: { type: "number", minimum: 0 },
  },
  required: [
    "planterVolume",
    "rootballVolume",
    "drainageVolume",
    "sharedVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { freeVolume: { type: "number" } },
  required: ["freeVolume"],
} as const;
/** Signed free-volume budget using an independently supplied rootball/drainage intersection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { planterVolume, rootballVolume, drainageVolume, sharedVolume } =
    request;
  const compute = (): Output => {
    H.domain(
      planterVolume >= 0 &&
        rootballVolume >= 0 &&
        drainageVolume >= 0 &&
        sharedVolume >= 0 &&
        sharedVolume <= Math.min(rootballVolume, drainageVolume),
    );
    return {
      freeVolume:
        planterVolume - rootballVolume - drainageVolume + sharedVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    planterVolume: 100,
    rootballVolume: 30,
    drainageVolume: 10,
    sharedVolume: 0,
  },
  output: { freeVolume: 60 },
} satisfies ToolExample<Input, Output>;
export const planterRootballFreeVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/planter-rootball-free-volume",
    title: "Planter Rootball Free Volume Tool",
    description:
      "Signed free-volume budget using an independently supplied rootball/drainage intersection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        planterVolume: { type: "number", minimum: 0 },
        rootballVolume: { type: "number", minimum: 0 },
        drainageVolume: { type: "number", minimum: 0 },
        sharedVolume: { type: "number", minimum: 0 },
      },
      required: [
        "planterVolume",
        "rootballVolume",
        "drainageVolume",
        "sharedVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { freeVolume: { type: "number" } },
      required: ["freeVolume"],
    },
    ports: {
      inputs: [
        {
          id: "planterVolume",
          label: "Planter Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rootballVolume",
          label: "Rootball Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drainageVolume",
          label: "Drainage Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedVolume",
          label: "Shared Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "freeVolume",
          label: "Free Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = planterRootballFreeVolumeTool.execute;
export default planterRootballFreeVolumeTool;
