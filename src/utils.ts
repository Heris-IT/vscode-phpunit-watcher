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

export function parseResults(results: string): Results {
    const regex = new RegExp(/(\d+) \/ (\d+) \((\d\d?\d?)\%\).*\r?\n\r?\nTime: (\d{2}:\d{2}.\d{3}), Memory: (\d+(?:.\d+)? (?:M|G)B)\r?\n\r?\n(?:(OK) \((\d+) tests, (\d+) assertions\)|(?:.*\r?\n)*(FAIL)URES!\r?\nTests: (\d+), Assertions: (\d+), Failures: (\d+)|(?:.*\r?\n)*(ERROR)S!\r?\nTests: (\d+), Assertions: (\d+), Errors: (\d+))/, 'gm');
    const a = regex.exec(results);
    const [, okTasks, totalTasks, percentage, time, memory, successStatus, successTests, successAssertions, failStatus, failTests, failAssertions, failures, errorStatus, errorTests, errorAssertions, errors] = a ?? [];
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
    console.log(result);
    return result;
}

export function showResults({ success, failures, errors }: Results): string {
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
}

export function showPlural(value: number, plural: string, single: string): string {
    if (value === 1) {
        return `${value} ${single}`;
    } else {
        return `${value} ${plural}`;
    }
}