import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstScope: string;
  readonly firstLabel: string;
  readonly secondScope: string;
  readonly secondLabel: string;
};
export type Output = {
  readonly sameLabel: boolean;
  readonly sameScopedNode: boolean;
  readonly scopedFirstKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstScope: { type: "string", maxLength: 8192 },
    firstLabel: { type: "string", maxLength: 8192 },
    secondScope: { type: "string", maxLength: 8192 },
    secondLabel: { type: "string", maxLength: 8192 },
  },
  required: ["firstScope", "firstLabel", "secondScope", "secondLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameLabel: { type: "boolean" },
    sameScopedNode: { type: "boolean" },
    scopedFirstKey: { type: "string", maxLength: 8192 },
  },
  required: ["sameLabel", "sameScopedNode", "scopedFirstKey"],
} as const;
/** Compare explicitly scoped blank-node labels; the accepted label grammar is a documented ASCII subset rather than the complete RDF grammar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstScope, firstLabel, secondScope, secondLabel } = request;
  const compute = (): Output => {
    H.domain(
      firstScope.length > 0 &&
        secondScope.length > 0 &&
        /^_:[A-Za-z](?:[A-Za-z0-9._-]*[A-Za-z0-9_-])?(?![\s\S])/.test(
          firstLabel,
        ) &&
        /^_:[A-Za-z](?:[A-Za-z0-9._-]*[A-Za-z0-9_-])?(?![\s\S])/.test(
          secondLabel,
        ),
    );
    return {
      sameLabel: firstLabel === secondLabel,
      sameScopedNode: firstScope === secondScope && firstLabel === secondLabel,
      scopedFirstKey: JSON.stringify([firstScope, firstLabel]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstScope: "graph-A",
    firstLabel: "_:b1",
    secondScope: "graph-B",
    secondLabel: "_:b1",
  },
  output: {
    sameLabel: true,
    sameScopedNode: false,
    scopedFirstKey: '["graph-A","_:b1"]',
  },
} satisfies ToolExample<Input, Output>;
export const rdfBlankNodeLocalScopeGuardTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/rdf-blank-node-local-scope-guard",
    title: "RDF Blank Node Local Scope Guard Tool",
    description:
      "Compare explicitly scoped blank-node labels; the accepted label grammar is a documented ASCII subset rather than the complete RDF grammar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstScope: { type: "string", maxLength: 8192 },
        firstLabel: { type: "string", maxLength: 8192 },
        secondScope: { type: "string", maxLength: 8192 },
        secondLabel: { type: "string", maxLength: 8192 },
      },
      required: ["firstScope", "firstLabel", "secondScope", "secondLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameLabel: { type: "boolean" },
        sameScopedNode: { type: "boolean" },
        scopedFirstKey: { type: "string", maxLength: 8192 },
      },
      required: ["sameLabel", "sameScopedNode", "scopedFirstKey"],
    },
    ports: {
      inputs: [
        {
          id: "firstScope",
          label: "First Scope",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstLabel",
          label: "First Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondScope",
          label: "Second Scope",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondLabel",
          label: "Second Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sameLabel",
          label: "Same Label",
          valueType: { type: "boolean" },
        },
        {
          id: "sameScopedNode",
          label: "Same Scoped Node",
          valueType: { type: "boolean" },
        },
        {
          id: "scopedFirstKey",
          label: "Scoped First Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = rdfBlankNodeLocalScopeGuardTool.execute;
export default rdfBlankNodeLocalScopeGuardTool;
