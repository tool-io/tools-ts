import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visit: number;
  readonly start: number;
  readonly end: number;
  readonly startIncluded: boolean;
  readonly endIncluded: boolean;
};
export type Output = { readonly within: boolean; readonly atBoundary: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visit: { type: "number" },
    start: { type: "number" },
    end: { type: "number" },
    startIncluded: { type: "boolean" },
    endIncluded: { type: "boolean" },
  },
  required: ["visit", "start", "end", "startIncluded", "endIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { within: { type: "boolean" }, atBoundary: { type: "boolean" } },
  required: ["within", "atBoundary"],
} as const;
/** Apply explicitly supplied research visit-window endpoint conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visit, start, end, startIncluded, endIncluded } = request;
  const compute = (): Output => {
    H.domain(start <= end);
    return {
      within:
        (startIncluded ? visit >= start : visit > start) &&
        (endIncluded ? visit <= end : visit < end),
      atBoundary: visit === start || visit === end,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    visit: 10,
    start: 10,
    end: 20,
    startIncluded: true,
    endIncluded: false,
  },
  output: { within: true, atBoundary: true },
} satisfies ToolExample<Input, Output>;
export const researchVisitWindowEdgeClosureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/research-visit-window-edge-closure",
    title: "Research Visit Window Edge Closure Tool",
    description:
      "Apply explicitly supplied research visit-window endpoint conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visit: { type: "number" },
        start: { type: "number" },
        end: { type: "number" },
        startIncluded: { type: "boolean" },
        endIncluded: { type: "boolean" },
      },
      required: ["visit", "start", "end", "startIncluded", "endIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        within: { type: "boolean" },
        atBoundary: { type: "boolean" },
      },
      required: ["within", "atBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "visit",
          label: "Visit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startIncluded",
          label: "Start Included",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "endIncluded",
          label: "End Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "within", label: "Within", valueType: { type: "boolean" } },
        {
          id: "atBoundary",
          label: "At Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchVisitWindowEdgeClosureTool.execute;
export default researchVisitWindowEdgeClosureTool;
