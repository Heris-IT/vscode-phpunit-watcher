export type Status = 'OK' | 'FAIL';

export type Results = {
    okTasks: number,
    totalTasks: number,
    percentage: number,
    time: string,
    memory: string,
    status: Status,
    tests: number,
    assertions: number,
    failures: number,
    errors: number,
    success: boolean,
};

export enum Version {
    v10x,
    v9x,
    v8x,
    other
}

export const getPUPUnitVersion = (data: string): Version => {
    const regex = new RegExp(/PHPUnit (?<major>\d+).(?<minor>\d+).(?<maintenance>\d+) /, 'g');
    const results = regex.exec(data)?.groups ?? {};
    const { major, minor, maintenance } = results;
    if (major === '10') {
        return Version.v10x;
    } else if (major === '9') {
        return Version.v9x;
    } else if (major === '8') {
        return Version.v8x;
    } else {
        return Version.other;
    }
};

export const getRegexForVersion = (version: Version): RegExp => {
    if (version === Version.v8x) {
        return new RegExp(/(?<okTasks>\d+) \/ (?<totalTasks>\d+) \((?<percentage>\d\d?\d?)\%\).*\r?\n\r?\nTime: (?<time>\d+ ms), Memory: (?<memory>\d+(?:.\d+)? (?:M|G)B)\r?\n\r?\n(?:(?<successStatus>OK) \((?<successTests>\d+) tests?, (?<successAssertions>\d+) assertions?\)|(?:.*\r?\n)*(?<failStatus>FAIL)URES!\r?\nTests?: (?<failTests>\d+), Assertions?: (?<failAssertions>\d+), Failures?: (?<failures>\d+)|(?:.*\r?\n)*(?<errorStatus>ERROR)S!\r?\nTests?: (?<errorTests>\d+), Assertions?: (?<errorAssertions>\d+), Errors?: (?<errors>\d+))/, 'gm');
    }
    return new RegExp(/(?<okTasks>\d+) \/ (?<totalTasks>\d+) \((?<percentage>\d\d?\d?)\%\).*\r?\n\r?\nTime: (?<time>\d{2}:\d{2}.\d{3}), Memory: (?<memory>\d+(?:.\d+)? (?:M|G)B)\r?\n\r?\n(?:(?<successStatus>OK) \((?<successTests>\d+) tests?, (?<successAssertions>\d+) assertions?\)|(?:.*\r?\n)*(?<failStatus>FAIL)URES!\r?\nTests?: (?<failTests>\d+), Assertions?: (?<failAssertions>\d+), Failures?: (?<failures>\d+)|(?:.*\r?\n)*(?<errorStatus>ERROR)S!\r?\nTests?: (?<errorTests>\d+), Assertions?: (?<errorAssertions>\d+), Errors?: (?<errors>\d+))/, 'gm');
};

export const parseResults = (results: string): Results => {
    const version = getPUPUnitVersion(results);
    const regex = getRegexForVersion(version);
    const a = regex.exec(results);
    const { okTasks, totalTasks, percentage, time, memory, successStatus, successTests, successAssertions, failStatus, failTests, failAssertions, failures, errorStatus, errorTests, errorAssertions, errors } = a?.groups ?? {};
    const result: Results = {
        okTasks: +okTasks,
        totalTasks: +totalTasks,
        percentage: +percentage,
        time,
        memory,
        status: (successStatus ?? failStatus ?? errorStatus) as Status,
        tests: +(successTests ?? failTests ?? errorTests),
        assertions: +(successAssertions ?? failAssertions ?? errorAssertions),
        failures: +(failures ?? 0),
        errors: +(errors ?? 0),
        success: successStatus === 'OK'
    };
    return result;
};

export const showResults = ({ success, failures, errors }: Results): string => {
    if (success) {
        return `PHPUnit Success`;
    } else {
        const errorText = showPlural(errors, 'errors', 'error');
        const failureText = showPlural(failures, 'failures', 'failure');
        if (errors > 0 && failures > 0) {
            return `PHPUnit Error (${errorText} / ${failureText})`;
        } else if (errors > 0) {
            return `PHPUnit Error (${errorText})`;
        } else {
            return `PHPUnit Failure (${failureText})`;
        }
    }
};

export const showPlural = (value: number, plural: string, single: string): string => {
    if (value === 1) {
        return `${value} ${single}`;
    } else {
        return `${value} ${plural}`;
    }
};

export const parseLanguageIds = (languageIds: string = '', defaultLanguageIds: string = "php"): string[] => {
    const extensions = languageIds.split(',').map(item => item.trim().replace(/^(\.+)/g, '')).filter(item => item.length > 0);
    if (extensions.length > 0) {
        return extensions;
    } else {
        return parseLanguageIds(defaultLanguageIds);
    }
};