import Profile from '../../profile';
import chalk from "chalk";
export default async () => {
    const profiles = await Profile.findAll();
    fmtDisplay(profiles);
};
const toTable = (profile) => {
    return {
        name: chalk.cyan(profile.name),
        facebook: profile.facebook ? '✅' : '❌',
        instagram: profile.instagram ? '✅' : '❌',
        twitter: profile.twitter ? '✅' : '❌',
        fullpath: chalk.yellow(profile.fullpath),
    };
};
const fmtDisplay = (profiles) => {
    console.table(profiles.map(toTable));
};
