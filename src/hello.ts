import {Octokit} from '@octokit/rest';

import fs from 'fs'
import {components} from '@octokit/openapi-types';

const githubToken = process.argv[2];

const octokit = new Octokit({auth: githubToken});

type Contributor = {
  username?: string;
  commits: number;
}

const dataFile = "data/data.json";

async function readData(): Promise<components["schemas"]["minimal-repository"][]> {
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  }

  const response = await octokit.rest.repos.listForUser({
    username: "obscuren",
    type: "all"
  });


  if (response.status === 200) {
    const data = response.data

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 4), 'utf-8');
    return data;
  }

  throw new Error("Can't find data");
}

async function hello() {

  const data = await readData();

  const repoNames = data.map(it => it.name)

  console.log("### repoNames", JSON.stringify(repoNames, null, 4));
}

hello()

