import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personIds: readonly string[];
  readonly courseIds: readonly string[];
  readonly requiredVersions: readonly string[];
  readonly acknowledgedVersions: readonly string[];
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly requiredPairs: number;
  readonly supportedPairs: number;
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
    courseIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredVersions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    acknowledgedVersions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "personIds",
    "courseIds",
    "requiredVersions",
    "acknowledgedVersions",
    "sourceVerified",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredPairs: { type: "integer" },
    supportedPairs: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["requiredPairs", "supportedPairs", "share", "defined"],
} as const;
/** Calculate training source support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    personIds,
    courseIds,
    requiredVersions,
    acknowledgedVersions,
    sourceVerified,
  } = request;
  const compute = (): Output => {
    H.sameLength(personIds, courseIds);
    H.sameLength(personIds, requiredVersions);
    H.sameLength(personIds, acknowledgedVersions);
    H.sameLength(personIds, sourceVerified);
    return (() => {
      const all = new Map<string, Set<string>>(),
        yes = new Map<string, Set<string>>();
      personIds.forEach((p, i) => {
        const s = all.get(p) ?? new Set<string>();
        s.add(courseIds[i]);
        all.set(p, s);
        if (
          sourceVerified[i] &&
          requiredVersions[i] === acknowledgedVersions[i]
        ) {
          const t = yes.get(p) ?? new Set<string>();
          t.add(courseIds[i]);
          yes.set(p, t);
        }
      });
      const requiredPairs = [...all.values()].reduce((s, x) => s + x.size, 0),
        supportedPairs = [...yes.values()].reduce((s, x) => s + x.size, 0);
      return {
        requiredPairs,
        supportedPairs,
        share: requiredPairs ? supportedPairs / requiredPairs : 0,
        defined: requiredPairs > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personIds: ["p1", "p1"],
    courseIds: ["a", "b"],
    requiredVersions: ["v2", "v2"],
    acknowledgedVersions: ["v2", "v1"],
    sourceVerified: [true, true],
  },
  output: { requiredPairs: 2, supportedPairs: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const trainingSourceSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/training-source-support-share",
    title: "Training Source Support Share Tool",
    description:
      "Calculate training source support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        courseIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredVersions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        acknowledgedVersions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "personIds",
        "courseIds",
        "requiredVersions",
        "acknowledgedVersions",
        "sourceVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredPairs: { type: "integer" },
        supportedPairs: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["requiredPairs", "supportedPairs", "share", "defined"],
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
          id: "courseIds",
          label: "Course Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredVersions",
          label: "Required Versions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "acknowledgedVersions",
          label: "Acknowledged Versions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceVerified",
          label: "Source Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "requiredPairs",
          label: "Required Pairs",
          valueType: { type: "integer" },
        },
        {
          id: "supportedPairs",
          label: "Supported Pairs",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = trainingSourceSupportShareTool.execute;
export default trainingSourceSupportShareTool;
