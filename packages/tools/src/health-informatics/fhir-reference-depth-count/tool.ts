import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reference: string };
export type Output = {
  readonly pathSegments: number;
  readonly fragmentPresent: boolean;
  readonly historyVersionPresent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pathSegments: { type: "integer" },
    fragmentPresent: { type: "boolean" },
    historyVersionPresent: { type: "boolean" },
  },
  required: ["pathSegments", "fragmentPresent", "historyVersionPresent"],
} as const;
/** Inspect literal FHIR reference path depth and final history-version syntax, without resolving or validating resources. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference } = request;
  const compute = (): Output => {
    const hash = reference.indexOf("#"),
      base = hash < 0 ? reference : reference.slice(0, hash),
      path = base
        .replace(/^[A-Za-z][A-Za-z0-9+.-]*:\/\/[^/]*/, "")
        .split("?")[0],
      segments = path.split("/").filter((x) => x.length > 0);
    return {
      pathSegments: segments.length,
      fragmentPresent: hash >= 0,
      historyVersionPresent:
        segments.length >= 2 && segments[segments.length - 2] === "_history",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "Patient/123/_history/2" },
  output: {
    pathSegments: 4,
    fragmentPresent: false,
    historyVersionPresent: true,
  },
} satisfies ToolExample<Input, Output>;
export const fhirReferenceDepthCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/fhir-reference-depth-count",
    title: "FHIR Reference Depth Count Tool",
    description:
      "Inspect literal FHIR reference path depth and final history-version syntax, without resolving or validating resources.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reference: { type: "string", maxLength: 8192 } },
      required: ["reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pathSegments: { type: "integer" },
        fragmentPresent: { type: "boolean" },
        historyVersionPresent: { type: "boolean" },
      },
      required: ["pathSegments", "fragmentPresent", "historyVersionPresent"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "pathSegments",
          label: "Path Segments",
          valueType: { type: "integer" },
        },
        {
          id: "fragmentPresent",
          label: "Fragment Present",
          valueType: { type: "boolean" },
        },
        {
          id: "historyVersionPresent",
          label: "History Version Present",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = fhirReferenceDepthCountTool.execute;
export default fhirReferenceDepthCountTool;
