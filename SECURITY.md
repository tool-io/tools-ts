# Security policy

## Reporting a vulnerability

Use the repository's
[Security tab](https://github.com/tool-io/tools-ts/security) to
check whether private vulnerability reporting is available. If
it is not, open an issue requesting a private reporting channel
without including vulnerability details. Keep exploit
instructions, credentials, and sensitive data out of public
issues.

Include the affected commit or package version, tool ID or
exported function, runtime, a minimal reproduction, and the
potential impact. Use synthetic inputs; do not send other
people's personal information or production secrets.

Reports are reviewed by the project maintainers. There is no
guaranteed response time, paid support agreement, or bug bounty.
Please coordinate public disclosure with the maintainers so
users can receive a fix and guidance first.

## Supported versions

The project is an alpha prerelease. Security fixes target the
latest development revision; older revisions do not receive a
separate maintenance guarantee. Any future supported release
branches will be listed here explicitly.

## Scope and safe testing

Relevant issues include input-validation bypasses, unsafe
handling of untrusted data, prototype pollution, unintended code
execution, and practical resource-exhaustion attacks against
portable library APIs. A mathematical mistake without a security
impact should normally be reported as a regular bug, with a
reference calculation and reproducible input.

Test locally against your own checkout. This policy does not
authorize testing tool.io production services, accessing other
users' data, or disrupting any service. Application
authentication, networking, storage, and permissions are owned
by the consuming application, not by this library.

Treat tool results as data, not trusted HTML, SQL, shell
commands, or medical, legal, financial, or safety decisions.
Consumers must validate application limits and apply
context-appropriate escaping when displaying or forwarding
results. Use a maintained Node.js release and review dependency
advisories.
