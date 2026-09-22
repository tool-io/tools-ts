import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citedVersion: string;
  readonly currentVersion: string;
  readonly relationsFrom: readonly string[];
  readonly relationsTo: readonly string[];
};
export type Output = {
  readonly sameVersion: boolean;
  readonly explicitRelation: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citedVersion: { type: "string", maxLength: 8192 },
    currentVersion: { type: "string", maxLength: 8192 },
    relationsFrom: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    relationsTo: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["citedVersion", "currentVersion", "relationsFrom", "relationsTo"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameVersion: { type: "boolean" },
    explicitRelation: { type: "boolean" },
  },
  required: ["sameVersion", "explicitRelation"],
} as const;
/** Check an explicit version relation without inferring correction, retraction or publication equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citedVersion, currentVersion, relationsFrom, relationsTo } = request;
  const compute = (): Output => {
    H.sameLength(relationsFrom, relationsTo);
    return {
      sameVersion: citedVersion === currentVersion,
      explicitRelation: relationsFrom.some(
        (x, i) => x === citedVersion && relationsTo[i] === currentVersion,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    citedVersion: "v1",
    currentVersion: "v2",
    relationsFrom: ["v1"],
    relationsTo: ["v2"],
  },
  output: { sameVersion: false, explicitRelation: true },
} satisfies ToolExample<Input, Output>;
export const referenceVersionRelationMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/reference-version-relation-marker",
    title: "Reference Version Relation Marker Tool",
    description:
      "Check an explicit version relation without inferring correction, retraction or publication equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citedVersion: { type: "string", maxLength: 8192 },
        currentVersion: { type: "string", maxLength: 8192 },
        relationsFrom: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        relationsTo: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "citedVersion",
        "currentVersion",
        "relationsFrom",
        "relationsTo",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameVersion: { type: "boolean" },
        explicitRelation: { type: "boolean" },
      },
      required: ["sameVersion", "explicitRelation"],
    },
    ports: {
      inputs: [
        {
          id: "citedVersion",
          label: "Cited Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentVersion",
          label: "Current Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "relationsFrom",
          label: "Relations From",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "relationsTo",
          label: "Relations To",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "sameVersion",
          label: "Same Version",
          valueType: { type: "boolean" },
        },
        {
          id: "explicitRelation",
          label: "Explicit Relation",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = referenceVersionRelationMarkerTool.execute;
export default referenceVersionRelationMarkerTool;
