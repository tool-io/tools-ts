import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HandleUrnBuilderInput = {
  readonly prefix: string;
  readonly suffix: string;
};

export type HandleUrnBuilderOutput = {
  readonly handle: string;
  readonly hdlUri: string;
  readonly resolverUrl: string;
};

const PREFIX = /^\d+(\.\d+)*$/;

export const calculateHandleUrnBuilder = (
  input: HandleUrnBuilderInput,
): HandleUrnBuilderOutput => {
  const prefix = input.prefix.trim();
  const suffix = input.suffix.trim();
  if (prefix.length === 0 || !PREFIX.test(prefix))
    simpleError(
      "prefix",
      "Handle prefix must be a numeric namespace such as 20.1000.",
      "invalid_prefix",
    );
  if (suffix.length === 0 || /\s/.test(suffix))
    simpleError(
      "suffix",
      "Handle suffix must be non-empty without whitespace.",
      "invalid_suffix",
    );
  const handle = `${prefix}/${suffix}`;
  const encodedHandle = `${prefix}/${suffix
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
  return {
    handle,
    hdlUri: `hdl:${encodedHandle}`,
    resolverUrl: `https://hdl.handle.net/${encodedHandle}`,
  };
};

export const handleUrnBuilderExample = {
  input: { prefix: "20.1000", suffix: "finding-aid-001" },
  output: {
    handle: "20.1000/finding-aid-001",
    hdlUri: "hdl:20.1000/finding-aid-001",
    resolverUrl: "https://hdl.handle.net/20.1000/finding-aid-001",
  },
} satisfies ToolExample<HandleUrnBuilderInput, HandleUrnBuilderOutput>;

export const handleUrnBuilderTool = createSimpleTool({
  id: "archival-studies/handle-urn-builder",
  title: "Handle URN Namespace Component Builder",
  description:
    "Assemble a Handle identifier from a numeric naming-authority prefix and local suffix, then percent-encode reserved characters in the hdl URI and resolver URL while preserving slash-delimited suffix components.",
  inputs: [
    {
      description: "Numeric handle naming authority, e.g. 20.1000.",
      id: "prefix",
      kind: "string",
      label: "Prefix",
    },
    {
      description: "Local suffix under the prefix; no whitespace.",
      id: "suffix",
      kind: "string",
      label: "Suffix",
    },
  ],
  outputs: [
    {
      description: "Combined handle of prefix/suffix.",
      id: "handle",
      kind: "string",
      label: "Handle",
    },
    {
      description: "Namespaced URI form hdl:<handle>.",
      id: "hdlUri",
      kind: "string",
      label: "hdl URI",
    },
    {
      description: "Resolver URL at hdl.handle.net.",
      id: "resolverUrl",
      kind: "string",
      label: "Resolver URL",
    },
  ],
  calculate: (input) =>
    calculateHandleUrnBuilder({
      prefix: input.prefix as string,
      suffix: input.suffix as string,
    }),
});

export const runHandleUrnBuilder = handleUrnBuilderTool.execute;
export default handleUrnBuilderTool;
