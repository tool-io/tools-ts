import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly times: readonly number[];
  readonly potentials: readonly number[];
  readonly turningTime: number;
  readonly keepTurningIn: string;
};
export type Output = {
  readonly beforeIndices: readonly number[];
  readonly afterIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    times: { type: "array", maxItems: 256, items: { type: "number" } },
    potentials: { type: "array", maxItems: 256, items: { type: "number" } },
    turningTime: { type: "number" },
    keepTurningIn: {
      type: "string",
      maxLength: 8192,
      enum: ["before", "after", "both"],
    },
  },
  required: ["times", "potentials", "turningTime", "keepTurningIn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    afterIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["beforeIndices", "afterIndices"],
} as const;
/** Partition supplied scan samples around an explicit turning time; potential values preserve sample alignment and do not determine the turn. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { times, potentials, turningTime, keepTurningIn } = request;
  const compute = (): Output => {
    H.sameLength(times, potentials);
    H.domain(
      times.every((x, i) => i === 0 || x >= times[i - 1]) &&
        ["before", "after", "both"].includes(keepTurningIn),
    );
    return {
      beforeIndices: times.flatMap((x, i) =>
        x < turningTime || (x === turningTime && keepTurningIn !== "after")
          ? [i]
          : [],
      ),
      afterIndices: times.flatMap((x, i) =>
        x > turningTime || (x === turningTime && keepTurningIn !== "before")
          ? [i]
          : [],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    times: [0, 1, 2],
    potentials: [0, 1, 0],
    turningTime: 1,
    keepTurningIn: "before",
  },
  output: { beforeIndices: [0, 1], afterIndices: [2] },
} satisfies ToolExample<Input, Output>;
export const scanReverseTurnPointDuplicateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/scan-reverse-turn-point-duplicate",
    title: "Scan Reverse Turn Point Duplicate Tool",
    description:
      "Partition supplied scan samples around an explicit turning time; potential values preserve sample alignment and do not determine the turn.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        times: { type: "array", maxItems: 256, items: { type: "number" } },
        potentials: { type: "array", maxItems: 256, items: { type: "number" } },
        turningTime: { type: "number" },
        keepTurningIn: {
          type: "string",
          maxLength: 8192,
          enum: ["before", "after", "both"],
        },
      },
      required: ["times", "potentials", "turningTime", "keepTurningIn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        afterIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["beforeIndices", "afterIndices"],
    },
    ports: {
      inputs: [
        {
          id: "times",
          label: "Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "potentials",
          label: "Potentials",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "turningTime",
          label: "Turning Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "keepTurningIn",
          label: "Keep Turning In",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "beforeIndices",
          label: "Before Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "afterIndices",
          label: "After Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = scanReverseTurnPointDuplicateTool.execute;
export default scanReverseTurnPointDuplicateTool;
