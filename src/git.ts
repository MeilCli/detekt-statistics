import * as exec from "@actions/exec";
import { Config } from "./config";

export async function echoCurrentBranch(): Promise<string> {
    const execOption: exec.ExecOptions = { ignoreReturnCode: true };
    let stdout = "";
    execOption.listeners = {
        stdout: (data: Buffer) => {
            stdout += data.toString();
        },
    };

    await exec.exec("git symbolic-ref --short HEAD", undefined, execOption);

    return stdout;
}

/**
 * return is initial branch
 */
export async function checkoutDataBranch(config: Config): Promise<boolean> {
    if (config.dataBranch == null) {
        return false;
    }

    const hasBranch = await hasDataBranch(config);
    if (hasBranch) {
        await exec.exec(`git checkout ${config.dataBranch}`);
        await exec.exec("git config pull.ff only");
        await exec.exec(`git pull origin ${config.dataBranch}`);
        return false;
    } else {
        await exec.exec(`git checkout --orphan ${config.dataBranch}`);
        return true;
    }
}

export async function checkoutBranch(branch: string) {
    await exec.exec(`git checkout ${branch}`);
}

export async function commit(config: Config, isInitialBranch: boolean) {
    await exec.exec(`git config --local user.name ${config.dataCommitUser}`);
    await exec.exec(`git config --local user.email ${config.dataCommitEmail}`);
    if (isInitialBranch) {
        await exec.exec("git rm -rf .");
    }
    await exec.exec(`git add ${config.dataJsonFilePath}`);
    await exec.exec("git commit --no-edit -m update");
}

export async function pushDataBranch(config: Config) {
    const remote = `https://x-access-token:${config.githubToken}@github.com/${config.repository}.git`;
    await exec.exec(`git push ${remote} HEAD:${config.dataBranch} -f`);
}

async function hasDataBranch(config: Config): Promise<boolean> {
    if (config.dataBranch == null) {
        return false;
    }

    const execOption: exec.ExecOptions = { ignoreReturnCode: true };
    let stdout = "";
    execOption.listeners = {
        stdout: (data: Buffer) => {
            stdout += data.toString();
        },
    };

    await exec.exec("git fetch --all");
    await exec.exec("git branch -a", undefined, execOption);

    return (
        0 <=
        stdout
            .split(" ")
            .map((x) => x.trim())
            .indexOf(`remotes/origin/${config.dataBranch}`)
    );
}
