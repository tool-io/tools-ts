import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly creativeVisible: readonly boolean[];
  readonly disclosureVisible: readonly boolean[];
};
export type Output = {
  readonly creativeDuration: number;
  readonly disclosedDuration: number;
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
    creativeVisible: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    disclosureVisible: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["durations", "creativeVisible", "disclosureVisible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creativeDuration: { type: "number" },
    disclosedDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["creativeDuration", "disclosedDuration", "share", "defined"],
} as const;
/** Measure explicitly reported visibility intervals, without inferring legal disclosure adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, creativeVisible, disclosureVisible } = request;
  const compute = (): Output => {
    H.sameLength(durations, creativeVisible);
    H.sameLength(durations, disclosureVisible);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const creativeDuration = durations.reduce(
          (s, x, i) => s + (creativeVisible[i] ? x : 0),
          0,
        ),
        disclosedDuration = durations.reduce(
          (s, x, i) => s + (creativeVisible[i] && disclosureVisible[i] ? x : 0),
          0,
        );
      return {
        creativeDuration,
        disclosedDuration,
        share: creativeDuration > 0 ? disclosedDuration / creativeDuration : 0,
        defined: creativeDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    durations: [2, 3, 5],
    creativeVisible: [true, true, false],
    disclosureVisible: [true, false, true],
  },
  output: {
    creativeDuration: 5,
    disclosedDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const creativeDisclosureVisibleTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/creative-disclosure-visible-time-share",
    title: "Creative Disclosure Visible Time Share Tool",
    description:
      "Measure explicitly reported visibility intervals, without inferring legal disclosure adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        creativeVisible: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        disclosureVisible: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["durations", "creativeVisible", "disclosureVisible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creativeDuration: { type: "number" },
        disclosedDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["creativeDuration", "disclosedDuration", "share", "defined"],
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
          id: "creativeVisible",
          label: "Creative Visible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "disclosureVisible",
          label: "Disclosure Visible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "creativeDuration",
          label: "Creative Duration",
          valueType: { type: "number" },
        },
        {
          id: "disclosedDuration",
          label: "Disclosed Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = creativeDisclosureVisibleTimeShareTool.execute;
export default creativeDisclosureVisibleTimeShareTool;
