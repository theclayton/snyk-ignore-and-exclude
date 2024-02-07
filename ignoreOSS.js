const USAGE = `Usage:

node ignoreOSS.js <filename>

----------------------------
Run the following and use thee output in this script
to create all the ignores needed for your .snyk file:

snyk test --json-file-output=test.json

----------------------------
To show this help menu, run:

node ignoreOSS.js -h
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

    for (const vuln of data.vulnerabilities) {
        if (map[vuln.id] === undefined) {
            map[vuln.id] = { paths: [], reason: `Backlog: ${vuln.severity} - ${vuln.title}` }
        }

        if (map[vuln.id].paths.length > 2 || map[vuln.id].paths[0] === "\'*\'") {
            map[vuln.id].paths = ["\'*\'"]
        } else {
            map[vuln.id].paths.push(vuln.from.join(' > '))
        }
    }

    let content = 'ignore:';
    const vulnIds = Object.keys(map)

    for (let i = 0; i < vulnIds.length; i++) {
        const id = vulnIds[i]
        const vuln = map[vulnIds[i]]

        content += `
    ${id}:
        - ${vuln.paths.join(' / ')}:
            reason: "${vuln.reason}"
            expires: ""`
    }

    console.log(content);
}

main();