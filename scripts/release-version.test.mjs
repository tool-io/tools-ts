import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseReleaseVersion,
  releaseVersionIssues,
} from "./release-version.mjs";

test("accepts SemVer releases, prereleases and build metadata", () => {
  for (const value of [
    "0.0.0",
    "1.2.3",
    "0.1.0-alpha.1",
    "1.0.0-rc.1",
    "1.0.0-0.3.7",
    "1.0.0-x.7.z.92",
    "1.0.0-alpha-1",
    "1.0.0-01a",
    "1.0.0+001.sha",
    "1.0.0-beta.2+build.42",
    "999999999999999999999.0.0",
  ])
    assert.ok(parseReleaseVersion(value), value);
});

test("rejects invalid versions previously accepted by a loose version regex", () => {
  for (const value of [
    undefined,
    null,
    1,
    "",
    "1.2",
    "v1.2.3",
    "01.2.3",
    "1.02.3",
    "1.2.03",
    "1.2.3-01",
    "1.2.3-alpha.01",
    "1.2.3-",
    "1.2.3-alpha..1",
    "1.2.3+",
    "1.2.3+build..1",
    "1.2.3_4",
    "1.2.3\n",
    " 1.2.3",
    "1.2.3 ",
  ])
    assert.equal(parseReleaseVersion(value), undefined, String(value));
});

test("requires an explicit matching npm prerelease channel", () => {
  for (const channel of ["alpha", "beta", "rc"]) {
    const version = `0.1.0-${channel}.1`;
    assert.deepEqual(
      releaseVersionIssues({ version, publishConfig: { tag: channel } }),
      [],
    );
    for (const tag of [undefined, "latest", "other"])
      assert.notDeepEqual(
        releaseVersionIssues({ version, publishConfig: { tag } }),
        [],
      );
  }
});

test("rejects unsupported release channels and build metadata as artifact identity", () => {
  assert.notDeepEqual(
    releaseVersionIssues({
      version: "1.0.0-dev.1",
      publishConfig: { tag: "dev" },
    }),
    [],
  );
  assert.notDeepEqual(releaseVersionIssues({ version: "1.0.0+build.1" }), []);
  assert.notDeepEqual(
    releaseVersionIssues({ version: "1.0.0", publishConfig: { tag: "alpha" } }),
    [],
  );
  assert.deepEqual(releaseVersionIssues({ version: "1.0.0" }), []);
  assert.deepEqual(
    releaseVersionIssues({
      version: "1.0.0",
      publishConfig: { tag: "latest" },
    }),
    [],
  );
});
