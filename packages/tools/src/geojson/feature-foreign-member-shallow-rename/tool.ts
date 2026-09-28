import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureJson: string;
  readonly from: string;
  readonly to: string;
};
export type Output = {
  readonly featureJson: string;
  readonly renamed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureJson: { type: "string", maxLength: 8192 },
    from: { type: "string", maxLength: 8192 },
    to: { type: "string", maxLength: 8192 },
  },
  required: ["featureJson", "from", "to"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureJson: { type: "string", maxLength: 8192 },
    renamed: { type: "boolean" },
  },
  required: ["featureJson", "renamed"],
} as const;
/** Calculate feature foreign member shallow rename from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureJson, from, to } = request;
  const compute = (): Output => {
    const f = H.plain(H.parseJson(featureJson));
    H.domain(f.type === "Feature");
    const reserved = [
      "type",
      "geometry",
      "properties",
      "id",
      "bbox",
      "features",
      "coordinates",
      "geometries",
    ];
    H.domain(
      !reserved.includes(from) &&
        !reserved.includes(to) &&
        (from === to || !Object.hasOwn(f, to)),
    );
    const renamed = from !== to && Object.hasOwn(f, from);
    return {
      featureJson: JSON.stringify(
        Object.fromEntries(
          Object.entries(f).map(([k, v]) => [
            renamed && k === from ? to : k,
            v,
          ]),
        ),
      ),
      renamed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    featureJson: '{"type":"Feature","source":"survey"}',
    from: "source",
    to: "provenance",
  },
  output: {
    featureJson: '{"type":"Feature","provenance":"survey"}',
    renamed: true,
  },
} satisfies ToolExample<Input, Output>;
export const featureForeignMemberShallowRenameTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/feature-foreign-member-shallow-rename",
    title: "Feature Foreign Member Shallow Rename Tool",
    description:
      "Calculate feature foreign member shallow rename from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureJson: { type: "string", maxLength: 8192 },
        from: { type: "string", maxLength: 8192 },
        to: { type: "string", maxLength: 8192 },
      },
      required: ["featureJson", "from", "to"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureJson: { type: "string", maxLength: 8192 },
        renamed: { type: "boolean" },
      },
      required: ["featureJson", "renamed"],
    },
    ports: {
      inputs: [
        {
          id: "featureJson",
          label: "Feature Json",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "from",
          label: "From",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "to",
          label: "To",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "featureJson",
          label: "Feature Json",
          valueType: { type: "string" },
        },
        { id: "renamed", label: "Renamed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = featureForeignMemberShallowRenameTool.execute;
export default featureForeignMemberShallowRenameTool;
