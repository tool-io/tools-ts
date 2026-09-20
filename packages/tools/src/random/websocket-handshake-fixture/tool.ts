import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { budget as fixtureBudget } from "../m500b-web-json-json.js";
import {
  object,
  array,
  text,
  bounded,
  boolean,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { coreOutput, token } from "../m500b-web-json-protocol.js";
import { parseUrl } from "../../core/url.js";
import { calculateWebsocketUrlValidator } from "../../web/websocket-url-validator/tool.js";
import { encodeBase64Bytes } from "../../http/basic-auth-parser/tool.js";
export type WebsocketHandshakeFixtureInput = {
  readonly urls: readonly string[];
  readonly headers: readonly {
    readonly name: string;
    readonly value: string;
  }[];
  readonly fragmentControl: boolean;
  readonly count: number;
  readonly seed?: number;
};
export type WebsocketHandshakeFixtureOutput = {
  readonly cases: readonly {
    readonly url: string;
    readonly validUrl: boolean;
    readonly nonceBytes: readonly number[];
    readonly key: string;
    readonly request: string;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    urls: array(text, 16, 1),
    headers: array(object({ name: text, value: text }), 16),
    fragmentControl: boolean,
    count: bounded(1, 16),
    seed: generatorSeedSchema,
  },
  ["urls", "headers", "fragmentControl", "count"],
);
export const outputSchema = object({
  cases: array(
    object({
      url: text,
      validUrl: boolean,
      nonceBytes: array(bounded(0, 255), 16, 16),
      key: text,
      request: text,
    }),
    16,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is WebsocketHandshakeFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateWebsocketHandshakeFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WebsocketHandshakeFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    if (
      input.headers.some(
        (h) =>
          !token.test(h.name) ||
          /[\x00-\x08\x0a-\x1f\x7f]/u.test(h.value) ||
          [
            "host",
            "upgrade",
            "connection",
            "sec-websocket-key",
            "sec-websocket-version",
          ].includes(h.name.toLowerCase()),
      )
    )
      simpleError(
        "headers",
        "Use valid field values and nonreserved header names; only horizontal tab is allowed among control characters.",
        "invalid_header",
      );
    for (const url of input.urls)
      if (!coreOutput(calculateWebsocketUrlValidator({ url })).valid)
        simpleError(
          "urls",
          "Supply valid WebSocket constructor URLs before mutation.",
          "invalid_url",
        );
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, () => {
      const base = pick(input.urls, random),
        parsed = parseUrl(base),
        url = base + (input.fragmentControl ? "#control" : "");
      const nonceBytes = Array.from({ length: 16 }, () =>
          random.integer(0, 255),
        ),
        key = encodeBase64Bytes(nonceBytes);
      const request = [
        "GET " + parsed.pathname + parsed.search + " HTTP/1.1",
        "Host: " + parsed.host,
        "Upgrade: websocket",
        "Connection: Upgrade",
        "Sec-WebSocket-Key: " + key,
        "Sec-WebSocket-Version: 13",
        ...input.headers.map((h) => h.name + ": " + h.value),
        "",
        "",
      ].join("\r\n");
      return {
        url,
        validUrl: coreOutput(calculateWebsocketUrlValidator({ url })).valid,
        nonceBytes,
        key,
        request,
      };
    });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const websocketHandshakeFixtureExample = {
  input: {
    urls: ["wss://example.com/chat"],
    headers: [],
    fragmentControl: false,
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        url: "wss://example.com/chat",
        validUrl: true,
        nonceBytes: [
          114, 218, 171, 44, 134, 69, 159, 221, 120, 63, 225, 190, 78, 50, 128,
          175,
        ],
        key: "ctqrLIZFn914P+G+TjKArw==",
        request:
          "GET /chat HTTP/1.1\r\nHost: example.com\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ctqrLIZFn914P+G+TjKArw==\r\nSec-WebSocket-Version: 13\r\n\r\n",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  WebsocketHandshakeFixtureInput,
  WebsocketHandshakeFixtureOutput
>;
export const websocketHandshakeFixtureTool = createModelDefinition<
  WebsocketHandshakeFixtureInput,
  WebsocketHandshakeFixtureOutput
>({
  id: "random/websocket-handshake-fixture",
  title: "Random WebSocket Handshake Fixture Generator",
  description:
    "Construct synthetic upgrade requests with reproducible 16-byte nonce keys and supplied headers, retaining URL-validity controls without claiming a complete handshake validator.",
  inputSchema,
  outputSchema,
  execute: calculateWebsocketHandshakeFixture,
});
export const runWebsocketHandshakeFixture =
  websocketHandshakeFixtureTool.execute;
export default websocketHandshakeFixtureTool;
