import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly jointIds: readonly string[];
  readonly sides: readonly string[];
  readonly observed: readonly boolean[];
  readonly leftLabel: string;
  readonly rightLabel: string;
};
export type Output = {
  readonly leftObserved: number;
  readonly rightObserved: number;
  readonly unpairedJointIds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sides: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    leftLabel: { type: "string", maxLength: 8192 },
    rightLabel: { type: "string", maxLength: 8192 },
  },
  required: ["jointIds", "sides", "observed", "leftLabel", "rightLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftObserved: { type: "integer" },
    rightObserved: { type: "integer" },
    unpairedJointIds: { type: "integer" },
  },
  required: ["leftObserved", "rightObserved", "unpairedJointIds"],
} as const;
/** Count explicit paired-side research observation coverage without scoring joint disease. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jointIds, sides, observed, leftLabel, rightLabel } = request;
  const compute = (): Output => {
    H.sameLength(jointIds, sides);
    H.sameLength(jointIds, observed);
    return (() => {
      H.domain(leftLabel !== rightLabel);
      const a = new Set(
          jointIds.filter((x, i) => observed[i] && sides[i] === leftLabel),
        ),
        b = new Set(
          jointIds.filter((x, i) => observed[i] && sides[i] === rightLabel),
        );
      return {
        leftObserved: a.size,
        rightObserved: b.size,
        unpairedJointIds: [...new Set([...a, ...b])].filter(
          (x) => a.has(x) !== b.has(x),
        ).length,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    jointIds: ["k", "k", "w"],
    sides: ["L", "R", "L"],
    observed: [true, true, true],
    leftLabel: "L",
    rightLabel: "R",
  },
  output: { leftObserved: 2, rightObserved: 1, unpairedJointIds: 1 },
} satisfies ToolExample<Input, Output>;
export const jointSideObservationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/joint-side-observation-gap",
    title: "Joint Side Observation Gap Tool",
    description:
      "Count explicit paired-side research observation coverage without scoring joint disease.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        jointIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sides: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        leftLabel: { type: "string", maxLength: 8192 },
        rightLabel: { type: "string", maxLength: 8192 },
      },
      required: ["jointIds", "sides", "observed", "leftLabel", "rightLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftObserved: { type: "integer" },
        rightObserved: { type: "integer" },
        unpairedJointIds: { type: "integer" },
      },
      required: ["leftObserved", "rightObserved", "unpairedJointIds"],
    },
    ports: {
      inputs: [
        {
          id: "jointIds",
          label: "Joint Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sides",
          label: "Sides",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "leftLabel",
          label: "Left Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rightLabel",
          label: "Right Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "leftObserved",
          label: "Left Observed",
          valueType: { type: "integer" },
        },
        {
          id: "rightObserved",
          label: "Right Observed",
          valueType: { type: "integer" },
        },
        {
          id: "unpairedJointIds",
          label: "Unpaired Joint Ids",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = jointSideObservationGapTool.execute;
export default jointSideObservationGapTool;
