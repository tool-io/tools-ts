import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly legume: readonly boolean[];
};
export type Output = {
  readonly legumeDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    legume: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["durations", "legume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    legumeDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["legumeDuration", "share", "defined"],
} as const;
/** Calculate rotation legume duration share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, legume } = request;
  const compute = (): Output => {
    H.sameLength(durations, legume);
    H.domain(durations.every((x) => x >= 0));
    return {
      legumeDuration: durations.reduce((a, b, i) => a + (legume[i] ? b : 0), 0),
      share: durations.some((x) => x > 0)
        ? durations.reduce((a, b, i) => a + (legume[i] ? b : 0), 0) /
          durations.reduce((a, b) => a + b, 0)
        : 0,
      defined: durations.some((x) => x > 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { durations: [2, 4], legume: [true, false] },
  output: { legumeDuration: 2, share: 0.3333333333333333, defined: true },
} satisfies ToolExample<Input, Output>;
export const rotationLegumeDurationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/rotation-legume-duration-share",
    title: "Rotation Legume Duration Share Tool",
    description:
      "Calculate rotation legume duration share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        legume: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["durations", "legume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        legumeDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["legumeDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "legume",
          label: "Legume",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "legumeDuration",
          label: "Legume Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = rotationLegumeDurationShareTool.execute;
export default rotationLegumeDurationShareTool;
