import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldAnchor: number;
  readonly newAnchor: number;
  readonly newObservation: number;
};
export type Output = {
  readonly linkFactor: number;
  readonly linkedObservation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldAnchor: { type: "number", exclusiveMinimum: 0 },
    newAnchor: { type: "number", exclusiveMinimum: 0 },
    newObservation: { type: "number" },
  },
  required: ["oldAnchor", "newAnchor", "newObservation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linkFactor: { type: "number" },
    linkedObservation: { type: "number" },
  },
  required: ["linkFactor", "linkedObservation"],
} as const;
/** Calculate economic history series splice anchor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldAnchor, newAnchor, newObservation } = request;
  const compute = (): Output => {
    H.positive(oldAnchor);
    H.positive(newAnchor);
    return {
      linkFactor: oldAnchor / newAnchor,
      linkedObservation: (newObservation * oldAnchor) / newAnchor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldAnchor: 80, newAnchor: 100, newObservation: 120 },
  output: { linkFactor: 0.8, linkedObservation: 96 },
} satisfies ToolExample<Input, Output>;
export const economicHistorySeriesSpliceAnchorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/economic-history-series-splice-anchor",
    title: "Economic History Series Splice Anchor Tool",
    description:
      "Calculate economic history series splice anchor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldAnchor: { type: "number", exclusiveMinimum: 0 },
        newAnchor: { type: "number", exclusiveMinimum: 0 },
        newObservation: { type: "number" },
      },
      required: ["oldAnchor", "newAnchor", "newObservation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linkFactor: { type: "number" },
        linkedObservation: { type: "number" },
      },
      required: ["linkFactor", "linkedObservation"],
    },
    ports: {
      inputs: [
        {
          id: "oldAnchor",
          label: "Old Anchor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newAnchor",
          label: "New Anchor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newObservation",
          label: "New Observation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "linkFactor",
          label: "Link Factor",
          valueType: { type: "number" },
        },
        {
          id: "linkedObservation",
          label: "Linked Observation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = economicHistorySeriesSpliceAnchorTool.execute;
export default economicHistorySeriesSpliceAnchorTool;
