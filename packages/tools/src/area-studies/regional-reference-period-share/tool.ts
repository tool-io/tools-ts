import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationStart: number;
  readonly observationEnd: number;
  readonly referenceStart: number;
  readonly referenceEnd: number;
  readonly excludedDuration: number;
};
export type Output = {
  readonly overlap: number;
  readonly supportedOverlap: number;
  readonly referenceShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationStart: { type: "number" },
    observationEnd: { type: "number" },
    referenceStart: { type: "number" },
    referenceEnd: { type: "number" },
    excludedDuration: { type: "number", minimum: 0 },
  },
  required: [
    "observationStart",
    "observationEnd",
    "referenceStart",
    "referenceEnd",
    "excludedDuration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "number" },
    supportedOverlap: { type: "number" },
    referenceShare: { type: "number" },
  },
  required: ["overlap", "supportedOverlap", "referenceShare"],
} as const;
/** Calculate regional reference period share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    observationStart,
    observationEnd,
    referenceStart,
    referenceEnd,
    excludedDuration,
  } = request;
  const compute = (): Output => {
    H.domain(
      observationEnd >= observationStart &&
        referenceEnd > referenceStart &&
        excludedDuration >= 0,
    );
    return (() => {
      const overlap = Math.max(
        0,
        Math.min(observationEnd, referenceEnd) -
          Math.max(observationStart, referenceStart),
      );
      H.domain(excludedDuration <= overlap);
      const supportedOverlap = overlap - excludedDuration;
      return {
        overlap,
        supportedOverlap,
        referenceShare: supportedOverlap / (referenceEnd - referenceStart),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationStart: 0,
    observationEnd: 10,
    referenceStart: 5,
    referenceEnd: 15,
    excludedDuration: 1,
  },
  output: { overlap: 5, supportedOverlap: 4, referenceShare: 0.4 },
} satisfies ToolExample<Input, Output>;
export const regionalReferencePeriodShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "area-studies/regional-reference-period-share",
    title: "Regional Reference Period Share Tool",
    description:
      "Calculate regional reference period share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationStart: { type: "number" },
        observationEnd: { type: "number" },
        referenceStart: { type: "number" },
        referenceEnd: { type: "number" },
        excludedDuration: { type: "number", minimum: 0 },
      },
      required: [
        "observationStart",
        "observationEnd",
        "referenceStart",
        "referenceEnd",
        "excludedDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "number" },
        supportedOverlap: { type: "number" },
        referenceShare: { type: "number" },
      },
      required: ["overlap", "supportedOverlap", "referenceShare"],
    },
    ports: {
      inputs: [
        {
          id: "observationStart",
          label: "Observation Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observationEnd",
          label: "Observation End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceStart",
          label: "Reference Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceEnd",
          label: "Reference End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedDuration",
          label: "Excluded Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        {
          id: "supportedOverlap",
          label: "Supported Overlap",
          valueType: { type: "number" },
        },
        {
          id: "referenceShare",
          label: "Reference Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = regionalReferencePeriodShareTool.execute;
export default regionalReferencePeriodShareTool;
