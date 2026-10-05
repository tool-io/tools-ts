import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ageDays: number;
  readonly lowerBounds: readonly number[];
  readonly labels: readonly string[];
};
export type Output = { readonly band: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "number", minimum: 0 },
    lowerBounds: { type: "array", maxItems: 256, items: { type: "number" } },
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["ageDays", "lowerBounds", "labels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { band: { type: "string", maxLength: 8192 } },
  required: ["band"],
} as const;
/** Classify work-item age using caller-defined inclusive lower band boundaries; no standard aging threshold is invented. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageDays, lowerBounds, labels } = request;
  const compute = (): Output => {
    H.domain(ageDays >= 0, "ageDays");
    H.sameLength(lowerBounds, labels);
    H.domain(
      lowerBounds.length > 0 &&
        lowerBounds[0] === 0 &&
        lowerBounds.every(
          (v, i) => v >= 0 && (i === 0 || v > lowerBounds[i - 1]),
        ),
      "lowerBounds",
    );
    let index = 0;
    lowerBounds.forEach((v, i) => {
      if (ageDays >= v) index = i;
    });
    return { band: labels[index] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ageDays: 12,
    lowerBounds: [0, 7, 14],
    labels: ["new", "week-old", "older"],
  },
  output: { band: "week-old" },
} satisfies ToolExample<Input, Output>;
export const workItemAgeingBandTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "management/work-item-ageing-band",
    title: "Work Item Ageing Band Tool",
    description:
      "Classify work-item age using caller-defined inclusive lower band boundaries; no standard aging threshold is invented.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageDays: { type: "number", minimum: 0 },
        lowerBounds: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["ageDays", "lowerBounds", "labels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { band: { type: "string", maxLength: 8192 } },
      required: ["band"],
    },
    ports: {
      inputs: [
        {
          id: "ageDays",
          label: "Age Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerBounds",
          label: "Lower Bounds",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [{ id: "band", label: "Band", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = workItemAgeingBandTool.execute;
export default workItemAgeingBandTool;
