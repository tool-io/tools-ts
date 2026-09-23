import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personIds: readonly string[];
  readonly sampleIds: readonly string[];
  readonly qualityAccepted: readonly boolean[];
  readonly enrollmentVerified: readonly boolean[];
};
export type Output = {
  readonly people: number;
  readonly supportedPeople: number;
  readonly distinctSupportedSamples: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sampleIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    qualityAccepted: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    enrollmentVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["personIds", "sampleIds", "qualityAccepted", "enrollmentVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    people: { type: "integer" },
    supportedPeople: { type: "integer" },
    distinctSupportedSamples: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "people",
    "supportedPeople",
    "distinctSupportedSamples",
    "share",
    "defined",
  ],
} as const;
/** Calculate enrolled sample support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personIds, sampleIds, qualityAccepted, enrollmentVerified } = request;
  const compute = (): Output => {
    H.sameLength(personIds, sampleIds);
    H.sameLength(personIds, qualityAccepted);
    H.sameLength(personIds, enrollmentVerified);
    return (() => {
      const all = new Set(personIds),
        yes = new Set(
          personIds.filter(
            (x, i) =>
              sampleIds[i].length > 0 &&
              qualityAccepted[i] &&
              enrollmentVerified[i],
          ),
        ),
        samples = new Set(
          sampleIds.filter(
            (x, i) =>
              x.length > 0 && qualityAccepted[i] && enrollmentVerified[i],
          ),
        );
      return {
        people: all.size,
        supportedPeople: yes.size,
        distinctSupportedSamples: samples.size,
        share: all.size ? yes.size / all.size : 0,
        defined: all.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personIds: ["p1", "p1", "p2"],
    sampleIds: ["a", "b", "c"],
    qualityAccepted: [true, false, false],
    enrollmentVerified: [true, true, true],
  },
  output: {
    people: 2,
    supportedPeople: 1,
    distinctSupportedSamples: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const enrolledSampleSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/enrolled-sample-support-share",
    title: "Enrolled Sample Support Share Tool",
    description:
      "Calculate enrolled sample support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sampleIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        qualityAccepted: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        enrollmentVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "personIds",
        "sampleIds",
        "qualityAccepted",
        "enrollmentVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        people: { type: "integer" },
        supportedPeople: { type: "integer" },
        distinctSupportedSamples: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "people",
        "supportedPeople",
        "distinctSupportedSamples",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "personIds",
          label: "Person Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sampleIds",
          label: "Sample Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "qualityAccepted",
          label: "Quality Accepted",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "enrollmentVerified",
          label: "Enrollment Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "people", label: "People", valueType: { type: "integer" } },
        {
          id: "supportedPeople",
          label: "Supported People",
          valueType: { type: "integer" },
        },
        {
          id: "distinctSupportedSamples",
          label: "Distinct Supported Samples",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = enrolledSampleSupportShareTool.execute;
export default enrolledSampleSupportShareTool;
