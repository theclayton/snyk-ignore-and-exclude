const USAGE = `Usage:

node ignoreIaC.js <filename>

----------------------------
Run the following and use thee output in this script
to create all the ignores needed for your .snyk file:

snyk iac test --json-file-output=iac.json

----------------------------
To show this help menu, run:

node ignoreIaC.js -h
`;

const fs = require('fs').promises;

async function main() {
    const path = process.argv[2];

    if (!path || path === '-h' || path === '--help') {
        console.log(USAGE);
        process.exit(1);
    }

    const fileContents = await fs.readFile(path, "utf8");

    let data = {}

    try {
        data = JSON.parse(fileContents);
    } catch (e) {
        console.log('Failed to parse JSON.');
        process.exit(1);
    }

    const map = {}

    for (const vuln of data) {
        for (const issue of vuln.infrastructureAsCodeIssues) {
            if (map[issue.id] === undefined) {
                map[issue.id] = {
                    reason: `Backlog: ${issue.severity} - ${issue.title}`
                }
            }
        }
    }

    let content = 'ignore:';
    const vulnIds = Object.keys(map)

    for (let i = 0; i < vulnIds.length; i++) {
        const id = vulnIds[i]
        const vuln = map[vulnIds[i]]

        content += `
    ${id}:
        - '*':
            reason: "${vuln.reason}"
            expires: ""`
    }

    console.log(content);
}

main();